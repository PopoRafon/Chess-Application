import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GuestGameRoom, UserGameRoom, ComputerGameRoom
from .utils import get_cookie

user_queue = []
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
                user_queue.append(self)

                await self.check_user_queue()
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
        if self in user_queue:
            user_queue.remove(self)
        elif self in guest_queue:
            guest_queue.remove(self)

    async def check_user_queue(self):
        if len(user_queue) >= 2:
            user_one = user_queue.pop()
            user_two = user_queue.pop()

            if user_one.user != user_two.user:
                room = await database_sync_to_async(UserGameRoom.objects.create)(
                    white_player=user_one.scope['user'],
                    black_player=user_two.scope['user']
                )

                await user_one.send(json.dumps({'url': str(room.id)}))
                await user_two.send(json.dumps({'url': str(room.id)}))
            else:
                user_queue.append(user_one)

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


class UserGameConsumer(GameConsumer):
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'game_{self.room_name}'
            user = self.scope['user']

            if user.is_authenticated:
                self.room = await database_sync_to_async(UserGameRoom.objects.prefetch_related('white_player', 'black_player').get)(id=self.room_name)

                if self.room.white_player == user or self.room.black_player == user:
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
            self.room = await database_sync_to_async(GuestGameRoom.objects.get)(id=self.room_name)

            if game_token and (self.room.white_player == game_token or self.room.black_player == game_token):
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
            self.room = await database_sync_to_async(ComputerGameRoom.objects.get)(id=self.room_name)

            if game_token and self.room.player == game_token:
                await self.channel_layer.group_add(
                    self.room_group_name,
                    self.channel_name
                )

                return await self.accept()

            await self.close()
        except Exception:
            await self.close()
