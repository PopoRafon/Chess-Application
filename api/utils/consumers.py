import json
from channels.db import database_sync_to_async
from api.models import GuestGameRoom, RankingGameRoom


class MatchmakingQueue:
    """
    Stores information about queues and matches users.
    """

    def __init__(self):
        self.ranking_queue = []
        self.guest_queue = []

    async def add_to_ranking_queue(self, consumer):
        self.ranking_queue.append(consumer)

    async def add_to_guest_queue(self, consumer):
        self.guest_queue.append(consumer)

    async def remove_from_queue(self, consumer):
        if consumer in self.ranking_queue:
            self.ranking_queue.remove(consumer)
        elif consumer in self.guest_queue:
            self.guest_queue.remove(consumer)

    async def check_ranking_queue(self):
        if len(self.ranking_queue) >= 2:
            for i, matchmaking_consumer in enumerate(self.ranking_queue[:-1]):
                if self.ranking_queue[-1].user != matchmaking_consumer.user:
                    if abs(self.ranking_queue[-1].user_profile.rating - matchmaking_consumer.user_profile.rating) <= 400:
                        room = await database_sync_to_async(RankingGameRoom.objects.create)(
                            white_player=self.ranking_queue[-1].user,
                            black_player=matchmaking_consumer.user
                        )

                        await self.ranking_queue[-1].send(json.dumps({'url': str(room.id)}))
                        await matchmaking_consumer.send(json.dumps({'url': str(room.id)}))

                        self.ranking_queue.remove(self.ranking_queue[-1])
                        self.ranking_queue.remove(matchmaking_consumer)

                        return
                else:
                    self.ranking_queue.pop(i)

    async def check_guest_queue(self):
        if len(self.guest_queue) >= 2:
            first_user = self.guest_queue.pop()
            second_user = self.guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await first_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await second_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))
