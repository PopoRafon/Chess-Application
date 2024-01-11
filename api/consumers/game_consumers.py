import json
import chess
from datetime import datetime, timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Game, Move, Message


class GameConsumer(AsyncWebsocketConsumer):
    """
    Parent Consumer class for all Game Consumers.
    Provides all necessary methods for game compliance.
    """

    async def connect(self):
        """
        This method must be overridden and must add additional attributes to game object:
        - self.user - User connected to socket.
        - self.room - Room object.
        - self.game_id - Game object id.
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
                case 'surrender':
                    await self.receive_surrender()
                case _:
                    await self.send_error()
        else:
            await self.send_error()

    async def send_error(self):
        await self.send(json.dumps({
            'error': 'Message you sent was invalid.'
        }))

    async def receive_message(self, data):
        _, body = data.values()
        body = body.strip()

        if await self.perform_message_validation(body):
            await database_sync_to_async(Message.objects.create)(game=self.game, sender=self.user, body=body)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'username': self.user.username,
                'body': body
            })
        else:
            await self.send_error()

    async def perform_message_validation(self, message):
        """
        Perform all necessary validations for message.
        Returns True if all validations pass.
        """
        if not message:
            return False
        elif len(message) > 255:
            return False

        return True

    async def send_message(self, event):
        _, username, body = event.values()

        await self.send(json.dumps({
            'type': 'message',
            'username': username,
            'body': body
        }))

    async def receive_surrender(self):
        player_color = await self.get_player_color()
        result = 'Surrender! ' + ('Black' if player_color == 'w' else 'White') + ' has won!'

        await self.end_game(result)

    async def end_game(self, result):
        """
        Setup up everything for game end and send game result to users.
        """
        await self.update_timers_in_game_object()

        self.game.result = result

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
            move = await self.perform_move_creation(move)

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_move',
                'white_points': self.game.white_points,
                'black_points': self.game.black_points,
                'fen': self.board.fen(),
                'move': move
            })
        else:
            await self.send_error()

    async def perform_move_validation(self, move):
        """
        Perform all necessary validations for move.
        Returns True if all validations pass.
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
        Returns move in algebraic notation.
        """
        await self.update_timers_in_game_object()
        await self.update_points_in_game_object(move)

        move_notation = self.board._algebraic(chess.Move.from_uci(move))
        self.board.push_uci(move)

        await database_sync_to_async(Move.objects.create)(
            game=self.game,
            fen=self.board.fen(),
            move=move_notation
        )

        self.game.fen = self.board.fen()

        if self.board.is_checkmate():
            result = 'Checkmate! ' + ('Black' if self.board.turn else 'White') + ' has won!'

            await self.end_game(result)
        elif self.board.is_stalemate():
            result = 'Stalemate! Draw!'

            await self.end_game(result)
        else:
            await self.game.asave()

        return move_notation

    async def update_timers_in_game_object(self):
        """
        Update timers in game object.
        """
        if self.game.started:
            last_move = await database_sync_to_async(self.game.moves.last)()

            if self.board.turn:
                self.game.white_timer = self.game.white_timer - (datetime.now(timezone.utc) - last_move.timestamp)
            else:
                self.game.black_timer = self.game.black_timer - (datetime.now(timezone.utc) - last_move.timestamp)
        else:
            self.game.started = True

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
        _, white_points, black_points, fen, move = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'white_points': white_points,
            'black_points': black_points,
            'fen': fen,
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
