import json, io, chess, chess.pgn
from datetime import datetime, timezone, timedelta
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from game.models import Game


class GameConsumer(AsyncWebsocketConsumer):
    """
    Parent Consumer class for all Game Consumers.
    Provides all necessary methods for game compliance.
    """

    async def connect(self):
        """
        This method must be overridden and must add additional attributes to game object:
        - `self.user` - User connected to socket.
        - `self.room` - Room object.
        - `self.game_id` - Game object id.
        """
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get('type')
        self.game = await self.get_game_object()
        self.board = chess.Board(fen=self.game.fen)

        if not self.game.result:
            match action_type:
                case 'move':
                    await self.receive_move(text_data_json)
                case 'message':
                    await self.receive_message(text_data_json)
                case 'resign':
                    await self.receive_resign()
                case 'timeout':
                    await self.receive_timeout()
                case _:
                    await self.send_error()
        else:
            await self.send_error()

    async def send_error(self):
        await self.send(json.dumps({
            'error': 'Message you sent was invalid.'
        }))

    async def receive_message(self, data):
        """
        This method should be only available and overridden in
        game rooms that use `User` model as foreign key in player field.
        """
        await self.send_error()

    async def receive_resign(self):
        player_color = await self.get_player_color()

        if self.game.started:
            result = f'winner: {"black" if player_color == "w" else "white"}/by: resignation'

            if await self.update_timers_in_game_object():
                await self.end_game(result)
        else:
            result = 'winner: draw/by: resignation'

            await self.end_game(result)

    async def receive_timeout(self):
        await self.update_timers_in_game_object()

    async def end_game(self, result):
        """
        Setup up everything for game end and send game result to users.
        """
        game_pgn = chess.pgn.read_game(io.StringIO(self.game.pgn))
        game_pgn.headers['Result'] = '1/2-1/2' if 'draw' in result else '1-0' if 'white' in result else '0-1'

        self.game.result = result
        self.game.pgn = str(game_pgn)

        await self.game.asave()

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_game_end',
            'result': result
        })

    async def send_game_end(self, event):
        _, result = event.values()

        await self.send(json.dumps({
            'type': 'game_end',
            'result': result
        }))

    async def receive_move(self, data):
        _, move = data.values()

        if await self.perform_move_validation(move):
            move_notation = self.board._algebraic(chess.Move.from_uci(move))
            await self.perform_move_creation(move)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_move',
                'white_points': self.game.white_points,
                'black_points': self.game.black_points,
                'move': move_notation
            })

    async def perform_move_validation(self, move):
        """
        Perform all necessary validations for move.
        Returns `True` if all validations pass.
        """
        try:
            player_color = await self.get_player_color()
            current_player_color = 'w' if self.board.turn else 'b'

            if player_color == current_player_color:
                move_uci = chess.Move.from_uci(move)

                return move_uci in self.board.legal_moves
            else:
                return False
        except chess.InvalidMoveError:
            return False

    async def perform_move_creation(self, move):
        """
        Add move to the Database and update current game state.
        """
        if await self.update_timers_in_game_object():
            await self.update_points_in_game_object(move)

            self.board.push_uci(move)
            self.game.fen = self.board.fen()
            game_pgn = chess.pgn.read_game(io.StringIO(self.game.pgn))
            node = None

            for mainline_node in game_pgn.mainline():
                node = mainline_node

            if node:
                node.add_variation(chess.Move.from_uci(move))
            else:
                game_pgn.add_variation(chess.Move.from_uci(move))

            self.game.pgn = str(game_pgn)

            if self.board.is_checkmate():
                result = f'winner: {"black" if self.board.turn else "white"}/by: checkmate'

                await self.end_game(result)
            elif self.board.is_stalemate():
                result = 'winner: draw/by: stalemate'

                await self.end_game(result)
            else:
                await self.game.asave()

    async def update_timers_in_game_object(self):
        """
        Update timers in game object. Checks if timers are in correct boundaries.
        Automatically calls `end_game` method if timers exceed their boundaries.
        Returns `True` if timers are correct and `False` if they exceeded their boundaries. 
        """
        if self.game.started:
            if self.board.turn:
                self.game.white_timer = max(self.game.white_timer - (datetime.now(timezone.utc) - self.game.last_move_timestamp), timedelta(seconds=0))

                if self.game.white_timer == timedelta(seconds=0):
                    await self.end_game(f'winner: {"black" if not self.board.has_insufficient_material(not self.board.turn) else "draw"}/by: timeout')

                    return False
            else:
                self.game.black_timer = max(self.game.black_timer - (datetime.now(timezone.utc) - self.game.last_move_timestamp), timedelta(seconds=0))

                if self.game.black_timer == timedelta(seconds=0):
                    await self.end_game(f'winner: {"white" if not self.board.has_insufficient_material(not self.board.turn) else "draw"}/by: timeout')

                    return False
        else:
            self.game.started = True

        self.game.last_move_timestamp = datetime.now(timezone.utc)

        return True

    async def update_points_in_game_object(self, move):
        """
        Update points in game object.
        """
        pieces_values = { 1: 1, 2: 3, 3: 3, 4: 5, 5: 9 } # 1 = pawn, 2 = knight, 3 = bishop, 4 = rook, 5 = queen
        piece_type = self.board.piece_type_at(chess.parse_square(move[2:4]))

        if self.board.turn:
            self.game.white_points += pieces_values.get(piece_type, 0)
        else:
            self.game.black_points += pieces_values.get(piece_type, 0)

    async def send_move(self, event):
        _, white_points, black_points, move = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'white_points': white_points,
            'black_points': black_points,
            'move': move
        }))

    async def get_player_color(self):
        """
        Get current player color from room object.
        Override this method if you have custom way to get players color.
        """
        return 'w' if self.room.white_player == self.user else 'b'

    async def get_game_object(self):
        """
        Get latest game object from database.
        """
        return await database_sync_to_async(Game.objects.get)(id=self.game_id)
