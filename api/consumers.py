import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GuestGameRoom, RankingGameRoom, ComputerGameRoom, Game
from .utils import get_cookie

ranking_queue = []
guest_queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.room_group_name = 'queue'
            self.user = self.scope['user']

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()

            if self.user.is_authenticated:
                ranking_queue.append(self)

                await self.check_ranking_queue()
            else:
                guest_queue.append(self)

                await self.check_guest_queue()
        except Exception:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self in ranking_queue:
            ranking_queue.remove(self)
        elif self in guest_queue:
            guest_queue.remove(self)

    async def check_ranking_queue(self):
        if len(ranking_queue) >= 2:
            user_one = ranking_queue.pop()
            user_two = ranking_queue.pop()

            if user_one.user != user_two.user:
                room = await database_sync_to_async(RankingGameRoom.objects.create)(
                    white_player=user_one.scope['user'],
                    black_player=user_two.scope['user']
                )

                await user_one.send(json.dumps({'url': str(room.id)}))
                await user_two.send(json.dumps({'url': str(room.id)}))
            else:
                ranking_queue.append(user_one)

    async def check_guest_queue(self):
        if len(guest_queue) >= 2:
            user_one = guest_queue.pop()
            user_two = guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await user_one.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await user_two.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))


class GameConsumer(AsyncWebsocketConsumer):
    """
    Parent Consumer class for all Game Consumers.
    Provides all needed methods for game compliance.
    """

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action_type = text_data_json.get('type')

        if action_type == 'move':
            await self.receive_move(text_data_json)
        elif action_type == 'promotion':
            await self.receive_promotion(text_data_json)
        else:
            await self.send_error()

    async def send_error(self):
        await self.send(json.dumps({
            'error': 'Message you sent was invalid.'
        }))

    async def receive_promotion(self, data):
        game = await database_sync_to_async(Game.objects.get)(id=self.game_id)
        _, promotion_type, (oldRow, oldCol), (newRow, newCol) = data.values()

        piece = game.positions[oldRow][oldCol]

        game.positions[newRow][newCol] = piece[0] + promotion_type
        game.positions[oldRow][oldCol] = ''

        game.turn = 'w' if game.turn == 'b' else 'b'

        await game.asave()

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_promotion',
            'turn': game.turn,
            'promotionType': promotion_type,
            'oldPos': [oldRow, oldCol],
            'newPos': [newRow, newCol]
        })

    async def send_promotion(self, event):
        _, turn, promotion_type, oldPos, newPos = event.values()

        await self.send(json.dumps({
            'type': 'promotion',
            'turn': turn,
            'promotionType': promotion_type,
            'oldPos': oldPos,
            'newPos': newPos
        }))

    async def receive_move(self, data):
        game = await database_sync_to_async(Game.objects.get)(id=self.game_id)
        _, (oldRow, oldCol), (newRow, newCol) = data.values()

        piece = game.positions[oldRow][oldCol]

        game.positions[newRow][newCol] = piece
        game.positions[oldRow][oldCol] = ''

        game.turn = 'w' if game.turn == 'b' else 'b'

        await game.asave()

        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'send_move',
            'turn': game.turn,
            'oldPos': [oldRow, oldCol],
            'newPos': [newRow, newCol]
        })

    async def send_move(self, event):
        _, turn, oldPos, newPos = event.values()

        await self.send(json.dumps({
            'type': 'move',
            'turn': turn,
            'oldPos': oldPos,
            'newPos': newPos
        }))


class RankingGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'game_{self.room_name}'
            user = self.scope['user']

            if user.is_authenticated:
                room = await database_sync_to_async(RankingGameRoom.objects.prefetch_related('white_player', 'black_player', 'game').get)(id=self.room_name)
                self.game_id = room.game.id

                if room.white_player == user or room.black_player == user:
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
            self.room_group_name = f'game_{self.room_name}'

            game_token = get_cookie(self.scope, 'guest_game_token')
            room = await database_sync_to_async(GuestGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = room.game.id

            if game_token and (room.white_player == game_token or room.black_player == game_token):
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()


class ComputerGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'game_{self.room_name}'

            game_token = get_cookie(self.scope, 'computer_game_token')
            room = await database_sync_to_async(ComputerGameRoom.objects.prefetch_related('game').get)(id=self.room_name)
            self.game_id = room.game.id

            if game_token and room.player == game_token:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()
