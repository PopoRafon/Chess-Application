from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import Profile
from api.utils.consumers import MatchmakingQueue


class MatchmakingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'queue'
        self.user = self.scope['user']

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        if self.user.is_authenticated:
            self.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.user)

            await MatchmakingQueue.add_to_ranking_queue(self)
            await MatchmakingQueue.check_ranking_queue()
        else:
            await MatchmakingQueue.add_to_guest_queue(self)
            await MatchmakingQueue.check_guest_queue()

    async def disconnect(self, close_code):
        await MatchmakingQueue.remove_from_queue(self)
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
