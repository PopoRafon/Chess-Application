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
    __ranking_queue = []
    __guest_queue = []

    @classmethod
    async def add_to_ranking_queue(cls, consumer):
        assert consumer.user.is_authenticated, 'User must be authenticated inorder to be added to the ranking queue.'
        cls.__ranking_queue.append(consumer)

    @classmethod
    async def add_to_guest_queue(cls, consumer):
        assert not consumer.user.is_authenticated, "User mustn't be authenticated inorder to be added to the guest queue."
        cls.__guest_queue.append(consumer)

    @classmethod
    async def remove_from_queue(cls, consumer):
        if consumer in cls.__ranking_queue:
            cls.__ranking_queue.remove(consumer)
        elif consumer in cls.__guest_queue:
            cls.__guest_queue.remove(consumer)

    @classmethod
    async def check_ranking_queue(cls):
        if len(cls.__ranking_queue) >= 2:
            for i, matchmaking_consumer in enumerate(cls.__ranking_queue[:-1]):
                if cls.__ranking_queue[-1].user != matchmaking_consumer.user:
                    if abs(cls.__ranking_queue[-1].user_profile.rating - matchmaking_consumer.user_profile.rating) <= 400:
                        room = await database_sync_to_async(RankingGameRoom.objects.create)(
                            white_player=cls.__ranking_queue[-1].user,
                            black_player=matchmaking_consumer.user
                        )

                        await cls.__ranking_queue[-1].send(json.dumps({'url': str(room.id)}))
                        await matchmaking_consumer.send(json.dumps({'url': str(room.id)}))

                        cls.__ranking_queue.remove(cls.__ranking_queue[-1])
                        cls.__ranking_queue.remove(matchmaking_consumer)

                        return
                else:
                    cls.__ranking_queue.pop(i)

    @classmethod
    async def check_guest_queue(cls):
        if len(cls.__guest_queue) >= 2:
            first_user = cls.__guest_queue.pop()
            second_user = cls.__guest_queue.pop()

            room = await database_sync_to_async(GuestGameRoom.objects.create)()

            await first_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.white_player}))
            await second_user.send(json.dumps({'url': str(room.id), 'guest_game_token': room.black_player}))
