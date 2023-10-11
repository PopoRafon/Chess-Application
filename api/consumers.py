from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from .models import Room
import json

queue = []

class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'queue'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        queue.append(self)

        await self.match_users()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self in queue:
            queue.remove(self)

    async def match_users(self):
        if len(queue) >= 2:
            user_one = queue.pop()
            user_two = queue.pop()

            room = await database_sync_to_async(Room.objects.create)()

            await user_one.send(json.dumps({'url': room.hashed_url}))
            await user_two.send(json.dumps({'url': room.hashed_url}))


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['game']
        self.room_group_name = f'game_{self.room_name}'

        if await self.check_room_exists(self.room_name):
            self.room = await database_sync_to_async(Room.objects.get)(hashed_url=self.room_name)

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
        else:
            await self.close()

    @sync_to_async
    def check_room_exists(self, hashed_url):
        return Room.objects.filter(hashed_url=hashed_url).exists()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
