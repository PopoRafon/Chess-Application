import sys, json, chess.engine
from django.conf import settings
from channels.db import database_sync_to_async
from api.utils import get_cookie, add_rating_points
from api.models import GuestGameRoom, RankingGameRoom, ComputerGameRoom, Profile, Message
from .game_consumers import GameConsumer

# Chess engine settings

if "runserver" in sys.argv:
    engine = chess.engine.SimpleEngine.popen_uci(settings.BASE_DIR / settings.ENV('ENGINE_PATH'))
    engine_limit = chess.engine.Limit(time=0.1)


class RankingGameConsumer(GameConsumer):
    async def end_game(self, result):
        await super().end_game(result)

        if self.game.started:
            white_player_profile = await database_sync_to_async(Profile.objects.get)(user=self.room.white_player)
            black_player_profile = await database_sync_to_async(Profile.objects.get)(user=self.room.black_player)

            if 'White' in result:
                white_player_profile.wins += 1
                black_player_profile.loses += 1
                add_rating_points(white_player_profile, black_player_profile)
            elif 'Black' in result:
                white_player_profile.loses += 1
                black_player_profile.wins += 1
                add_rating_points(black_player_profile, white_player_profile)
            else:
                white_player_profile.draws += 1
                black_player_profile.draws += 1

            await white_player_profile.asave()
            await black_player_profile.asave()

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
        Returns `True` if all validations pass.
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

    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'ranking_game_{self.room_name}'
            self.user = self.scope['user']

            if self.user.is_authenticated:
                self.room = await database_sync_to_async(RankingGameRoom.objects.prefetch_related('white_player', 'black_player', 'game').get)(id=self.room_name)
                self.game_id = self.room.game.id

                if self.room.white_player == self.user or self.room.black_player == self.user:
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )

                    return await self.accept()

            await self.close()
        except Exception:
            await self.close()


class GuestGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'guest_game_{self.room_name}'
            self.user = get_cookie(self.scope, 'guest_game_token')
            self.room = await database_sync_to_async(GuestGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = self.room.game.id

            if self.user and (self.room.white_player == self.user or self.room.black_player == self.user):
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()


class ComputerGameConsumer(GameConsumer):
    async def receive_move(self, data):
        await super().receive_move(data)

        if not self.board.turn and not self.board.is_game_over():
            move = engine.play(self.board, engine_limit).move
            move_notation = self.board._algebraic(move)

            await self.perform_move_creation(move.uci())

            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_move',
                'white_points': self.game.white_points,
                'black_points': self.game.black_points,
                'move': move_notation
            })

    async def update_timers_in_game_object(self):
        if not self.game.started:
            self.game.started = True

    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'computer_game_{self.room_name}'
            self.user = get_cookie(self.scope, 'computer_game_token')
            self.room = await database_sync_to_async(ComputerGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = self.room.game.id

            if self.user and self.room.player == self.user:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()

    async def get_player_color(self):
        return 'w'
