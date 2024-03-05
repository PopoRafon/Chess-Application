from django.urls import resolve, reverse
from rest_framework.test import APISimpleTestCase
from game.views import RankingGameRoomView, GuestGameRoomView, ComputerGameRoomRetrieveView, ComputerGameRoomCreateView


class TestGameRoomUrls(APISimpleTestCase):
    def test_ranking_game_room_url(self):
        url = reverse('ranking-game-room', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/ranking/game/room/1')
        self.assertEqual(resolver.func.view_class, RankingGameRoomView)

    def test_guest_game_room_url(self):
        url = reverse('guest-game-room', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/guest/game/room/1')
        self.assertEqual(resolver.func.view_class, GuestGameRoomView)

    def test_computer_game_room_retrieve_url(self):
        url = reverse('computer-game-room-retrieve', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/computer/game/room/1')
        self.assertEqual(resolver.func.view_class, ComputerGameRoomRetrieveView)

    def test_computer_game_room_create_url(self):
        url = reverse('computer-game-room-create')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/computer/game/room')
        self.assertEqual(resolver.func.view_class, ComputerGameRoomCreateView)
