import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import GuestGameRoom, RankingGameRoom, Profile

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
                self.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.user)
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
            for i, matchmaking_consumer in enumerate(ranking_queue[:-1]):
                if self.user != matchmaking_consumer.user:
                    if abs(self.user_profile.rating - matchmaking_consumer.user_profile.rating) <= 400:
                        ranking_queue.pop(len(ranking_queue) - 1)
                        ranking_queue.pop(i)

                        room = await database_sync_to_async(RankingGameRoom.objects.create)(
                            white_player=self.user,
                            black_player=matchmaking_consumer.user
                        )

                        await self.send(json.dumps({'url': str(room.id)}))
                        await matchmaking_consumer.send(json.dumps({'url': str(room.id)}))

                        return
                else:
                    ranking_queue.pop(i)

    async def check_guest_queue(self):
        if len(guest_queue) >= 2:
            first_user = guest_queue.pop()
            second_user = guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await first_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await second_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))
