import json, chess.engine
from django.conf import settings
from channels.db import database_sync_to_async
from api.models import GuestGameRoom, RankingGameRoom


class GameEngine:
    def __init__(self):
        self.engine = chess.engine.SimpleEngine.popen_uci(settings.BASE_DIR / settings.ENV('ENGINE_PATH'))
        self.engine_limit = chess.engine.Limit(time=0.1)


class MatchmakingQueue:
    """
    Encapsulates information about queues.
    Provides basic methods for queue manipulation and user matching.
    """
    ranking_queue = []
    guest_queue = []

    @classmethod
    async def add_to_ranking_queue(cls, consumer):
        cls.ranking_queue.append(consumer)

    @classmethod
    async def add_to_guest_queue(cls, consumer):
        cls.guest_queue.append(consumer)

    @classmethod
    async def remove_from_queue(cls, consumer):
        if consumer in cls.ranking_queue:
            cls.ranking_queue.remove(consumer)
        elif consumer in cls.guest_queue:
            cls.guest_queue.remove(consumer)

    @classmethod
    async def check_ranking_queue(cls):
        if len(cls.ranking_queue) >= 2:
            for i, matchmaking_consumer in enumerate(cls.ranking_queue[:-1]):
                if cls.ranking_queue[-1].user != matchmaking_consumer.user:
                    if abs(cls.ranking_queue[-1].user_profile.rating - matchmaking_consumer.user_profile.rating) <= 400:
                        room = await database_sync_to_async(RankingGameRoom.objects.create)(
                            white_player=cls.ranking_queue[-1].user,
                            black_player=matchmaking_consumer.user
                        )

                        await cls.ranking_queue[-1].send(json.dumps({'url': str(room.id)}))
                        await matchmaking_consumer.send(json.dumps({'url': str(room.id)}))

                        cls.ranking_queue.remove(cls.ranking_queue[-1])
                        cls.ranking_queue.remove(matchmaking_consumer)

                        return
                else:
                    cls.ranking_queue.pop(i)

    @classmethod
    async def check_guest_queue(cls):
        if len(cls.guest_queue) >= 2:
            first_user = cls.guest_queue.pop()
            second_user = cls.guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await first_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await second_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))
