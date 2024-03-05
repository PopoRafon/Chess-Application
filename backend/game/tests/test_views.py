from http.cookies import SimpleCookie
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from game.models import RankingGameRoom, GuestGameRoom, ComputerGameRoom


class TestRankingGameRoomView(APITestCase):
    def setUp(self):
        self.first_user = User.objects.create(username='first user')
        self.second_user = User.objects.create(username='second user')
        self.room = RankingGameRoom.objects.create(white_player=self.first_user, black_player=self.second_user)
        self.url = reverse('ranking-game-room', kwargs={'id': self.room.id})

    def test_ranking_game_room_GET_user_authorized(self):
        refresh = RefreshToken.for_user(self.first_user)
        access = refresh.access_token

        response = self.client.get(self.url, HTTP_AUTHORIZATION=f'Bearer {access}')
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 15)

    def test_ranking_game_room_GET_authenticated_user(self):
        third_user = User.objects.create(username='third user')
        refresh = RefreshToken.for_user(third_user)
        access = refresh.access_token

        response = self.client.get(self.url, HTTP_AUTHORIZATION=f'Bearer {access}')
        response_json = response.json()

        self.assertEqual(response.status_code, 403)
        self.assertEqual(len(response_json), 1)

    def test_ranking_game_room_GET_unauthenticated_user(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)


class TestGuestGameRoomView(APITestCase):
    def setUp(self):
        self.room = GuestGameRoom.objects.create()
        self.url = reverse('guest-game-room', kwargs={'id': self.room.id})

    def test_guest_game_room_GET_valid_data(self):
        self.client.cookies = SimpleCookie({'guest_game_token': self.room.white_player})
        response = self.client.get(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 7)

    def test_guest_game_room_GET_invalid_data(self):
        self.client.cookies = SimpleCookie({'guest_game_token': 'invalid_token'})
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)


class TestComputerGameRoomRetrieveView(APITestCase):
    def setUp(self):
        self.room = ComputerGameRoom.objects.create()
        self.url = reverse('computer-game-room-retrieve', kwargs={'id': self.room.id})

    def test_computer_game_room_GET_valid_data(self):
        self.client.cookies = SimpleCookie({'computer_game_token': self.room.player})
        response = self.client.get(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 4)

    def test_computer_game_room_GET_invalid_data(self):
        self.client.cookies = SimpleCookie({'computer_game_token': 'invalid_token'})
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, 401)


class TestComputerGameRoomCreateView(APITestCase):
    def test_computer_game_room_create_POST(self):
        url = reverse('computer-game-room-create')
        response = self.client.post(url)
        response_json = response.json()

        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response_json), 2)
        self.assertEqual(ComputerGameRoom.objects.count(), 1)
