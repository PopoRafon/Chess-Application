from django.test import TestCase
from channels.testing import WebsocketCommunicator
from channels.routing import URLRouter
from api.routing import websocket_urlpatterns
from api.models import GuestGameRoom


class TestMatchmakingConsumer(TestCase):
    async def test_matchmaking_consumer_connection(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            'ws/matchmaking/'
        )
        connected, _ = await communicator.connect()

        self.assertTrue(connected)

        await communicator.disconnect()


class TestGameConsumer(TestCase):
    def setUp(self):
        self.room = GuestGameRoom.objects.create()

    async def test_game_consumer_connection_valid_room(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            f'ws/game/{self.room.id}/'
        )
        connected, _ = await communicator.connect()

        self.assertTrue(connected)

        await communicator.disconnect()

    async def test_game_consumer_connection_invalid_room(self):
        communicator = WebsocketCommunicator(
            URLRouter(websocket_urlpatterns),
            'ws/game/1/'
        )
        connected, _ = await communicator.connect()

        self.assertFalse(connected)

        await communicator.disconnect()
