import json
import chess
from datetime import datetime, timezone, timedelta
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
        This method must be overridden and must add additional attributes:
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
        self.board = chess.Board(fen=self.game.FEN)

        if not self.game.result:
            match action_type:
                case 'move':
                    await self.receive_move(text_data_json)
                case 'message':
                    await self.receive_message(text_data_json)
                case 'surrender':
                    await self.receive_surrender()
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

    async def receive_timeout(self):
        if self.game.started:
            last_move = await database_sync_to_async(self.game.moves.last)()
            timer = ((self.game.white_timer if self.board.turn else self.game.black_timer) - (datetime.now(timezone.utc) - last_move.timestamp)).total_seconds()

            if timer <= 0:
                if self.board.has_insufficient_material(not self.board.turn):
                    result = 'Timeout! Draw!'
                else:
                    result = 'Timeout! ' + ('White' if not self.board.turn else 'Black') + ' has won!'

                await self.end_game(result)

                await self.channel_layer.group_send(self.room_group_name, {
                    'type': 'send_game_end',
                    'result': result
                })

    async def receive_surrender(self):
        player_color = await self.get_player_color()
        result = 'Surrender! ' + ('Black' if player_color == 'w' else 'White') + ' has won!'

        await self.end_game(result)

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

    async def end_game(self, result):
        """
        Method used for properly ending the game with correct settings.
        """
        last_move = await database_sync_to_async(self.game.moves.last)()

        if last_move:
            min_timer_time = timedelta(seconds=0)

            if self.board.turn:
                timer = self.game.white_timer - (datetime.now(timezone.utc) - last_move.timestamp)
                self.game.white_timer = max(min_timer_time, timer)
            else:
                timer = self.game.black_timer - (datetime.now(timezone.utc) - last_move.timestamp)
                self.game.black_timer = max(min_timer_time, timer)

        self.game.result = result

        await self.game.asave()

    async def receive_move(self, data):
        _, move = data.values()

        if await self.perform_move_validation(move):
            await self.perform_move_creation(move)

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
        Perform every validation needed for received move.
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
        """
        if self.game.started:
            last_move = await database_sync_to_async(self.game.moves.last)()

            if self.board.turn:
                self.game.white_timer = self.game.white_timer - (datetime.now(timezone.utc) - last_move.timestamp)
            else:
                self.game.black_timer = self.game.black_timer - (datetime.now(timezone.utc) - last_move.timestamp)
        else:
            self.game.started = True

        self.board.push_uci(move)

        await database_sync_to_async(Move.objects.create)(
            game=self.game,
            FEN=self.board.fen(),
            move=move
        )

        self.game.FEN = self.board.fen()

        if self.board.is_checkmate():
            result = 'Checkmate! ' + ('Black' if self.board.turn else 'White') + ' has won!'
            await self.end_game(result)
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_game_end',
                'result': result
            })
        elif self.board.is_stalemate():
            result = 'Stalemate! Draw!'
            await self.end_game(result)
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_game_end',
                'result': result
            })
        else:
            await self.game.asave()

    async def send_move(self, event):
        _, white_points, black_points, fen, move = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'whitePoints': white_points,
            'blackPoints': black_points,
            'fen': fen,
            'move': move
        }))

    async def get_player_color(self):
        """
        Method used for getting players color.
        Override this method if you have custom way to get players color.
        """
        return 'w' if self.room.white_player == self.user else 'b'

    async def get_game_object(self):
        """
        Method used for getting game object.
        """
        return await database_sync_to_async(Game.objects.get)(id=self.game_id)
