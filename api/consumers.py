from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import GuestGameRoom, UserGameRoom
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie
import json

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
    async def connect(self):
        try:
            self.room_name = self.scope['url_route']['kwargs']['game']
            self.room_group_name = f'game_{self.room_name}'
            user = self.scope['user']

            if user.is_authenticated:
                self.room = await database_sync_to_async(UserGameRoom.objects.get)(id=self.room_name)

                await self.get_players()

                if self.white_player == user or self.black_player == user:
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )

                    return await self.accept()
            else:
                game_token = SimpleCookie(dict(self.scope['headers']).get(b'cookie').decode('utf8')).get('guest_game_token').value
                self.room = await database_sync_to_async(GuestGameRoom.objects.get)(id=self.room_name)

                await self.get_players()

                if game_token and (self.white_player == game_token or self.black_player == game_token):
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )

                    return await self.accept()

            await self.close()
        except Exception:
            await self.close()

    @sync_to_async
    def get_players(self):
        self.white_player = self.room.white_player
        self.black_player = self.room.black_player

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
