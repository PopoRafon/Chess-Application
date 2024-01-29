from django.test import TransactionTestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from channels.db import database_sync_to_async
from api.utils.testing import websocket_communicator
from api.models import RankingGameRoom, GuestGameRoom, ComputerGameRoom, Profile


class TestMatchmakingConsumer(TransactionTestCase):
    def setUp(self):
        self.first_user = User.objects.create(username='first user')
        self.second_user = User.objects.create(username='second user')
        self.first_user_token = RefreshToken.for_user(self.first_user).access_token
        self.second_user_token = RefreshToken.for_user(self.second_user).access_token
        self.headers = lambda token: [(b'cookie', f'access={token}'.encode())]
        self.url = 'ws/matchmaking/'

    async def test_authenticated_users_within_same_rating_range_receive_game_url(self):
        first_comm = await websocket_communicator(self.url, self.headers(self.first_user_token))
        second_comm = await websocket_communicator(self.url, self.headers(self.second_user_token))

        first_comm_data = await first_comm.receive_json_from()
        second_comm_data = await second_comm.receive_json_from()

        self.assertEqual(len(first_comm_data['url']), 36)
        self.assertEqual(len(second_comm_data['url']), 36)

        self.assertEqual(first_comm_data['url'], second_comm_data['url'])

        await first_comm.disconnect()
        await second_comm.disconnect()

    async def test_unauthenticated_users_receive_game_url_with_game_token(self):
        first_comm = await websocket_communicator(self.url)
        second_comm = await websocket_communicator(self.url)

        first_comm_data = await first_comm.receive_json_from()
        second_comm_data = await second_comm.receive_json_from()

        self.assertEqual(len(first_comm_data['url']), 36)
        self.assertEqual(len(second_comm_data['url']), 36)

        self.assertEqual(first_comm_data['url'], second_comm_data['url'])

        self.assertEqual(len(second_comm_data['guest_game_token']), 64)
        self.assertEqual(len(second_comm_data['guest_game_token']), 64)

        self.assertNotEqual(first_comm_data['guest_game_token'], second_comm_data['guest_game_token'])

        await first_comm.disconnect()
        await second_comm.disconnect()

    async def test_the_same_authenticated_users_receive_nothing(self):
        first_comm = await websocket_communicator(self.url, self.headers(self.first_user_token))
        second_comm = await websocket_communicator(self.url, self.headers(self.first_user_token))

        self.assertTrue(await first_comm.receive_nothing())
        self.assertTrue(await second_comm.receive_nothing())

        await first_comm.disconnect()
        await second_comm.disconnect()

    async def test_authenticated_user_with_unauthenticated_user_receive_nothing(self):
        first_comm = await websocket_communicator(self.url, self.headers(self.first_user_token))
        second_comm = await websocket_communicator(self.url)

        self.assertTrue(await first_comm.receive_nothing())
        self.assertTrue(await second_comm.receive_nothing())

        await first_comm.disconnect()
        await second_comm.disconnect()

    async def test_authenticated_users_with_too_big_rating_range_receive_nothing(self):
        first_user_profile = await database_sync_to_async(Profile.objects.get)(user=self.first_user)
        first_user_profile.rating = 1300
        await first_user_profile.asave()

        first_comm = await websocket_communicator(self.url, self.headers(self.first_user_token))
        second_comm = await websocket_communicator(self.url, self.headers(self.second_user_token))

        self.assertTrue(await first_comm.receive_nothing())
        self.assertTrue(await second_comm.receive_nothing())

        await first_comm.disconnect()
        await second_comm.disconnect()


class TestRankingGameConsumer(TransactionTestCase):
    def setUp(self):
        self.first_user = User.objects.create(username='first user')
        self.second_user = User.objects.create(username='second user')
        self.first_user_token = RefreshToken.for_user(self.first_user)
        self.second_user_token = RefreshToken.for_user(self.second_user)
        self.room = RankingGameRoom.objects.create(white_player=self.first_user, black_player=self.second_user)
        self.url = f'ws/ranking/game/{self.room.id}/'
        self.headers = [(b'cookie', f'access={self.first_user_token}'.encode())]

    async def test_ranking_game_connection_valid_token(self):
        communicator = await websocket_communicator(self.url, self.headers)

        await communicator.disconnect()

    async def test_ranking_game_connection_invalid_token(self):
        with self.assertRaises(Exception):
            await websocket_communicator(self.url, [(b'cookie', b'access=invalid_token')])


class TestGuestGameConsumer(TransactionTestCase):
    def setUp(self):
        self.room = GuestGameRoom.objects.create()
        self.url = f'ws/guest/game/{self.room.id}/'
        self.headers = [(b'cookie', f'guest_game_token={self.room.white_player}'.encode())]

    async def test_guest_game_connection_valid_token(self):
        communicator = await websocket_communicator(self.url, self.headers)

        await communicator.disconnect()

    async def test_guest_game_connection_invalid_token(self):
        with self.assertRaises(Exception):
            await websocket_communicator(self.url, [(b'cookie', b'guest_game_token=invalid_token')])


class TestComputerGameConsumer(TransactionTestCase):
    def setUp(self):
        self.room = ComputerGameRoom.objects.create()
        self.url = f'ws/computer/game/{self.room.id}/'
        self.headers = [(b'cookie', f'computer_game_token={self.room.player}'.encode())]

    async def test_computer_game_connection_valid_token(self):
        communicator = await websocket_communicator(self.url, self.headers)

        await communicator.disconnect()

    async def test_computer_game_connection_invalid_token(self):
        with self.assertRaises(Exception):
            await websocket_communicator(self.url, [(b'cookie', b'computer_game_token=invalid_token')])
