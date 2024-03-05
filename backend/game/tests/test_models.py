from django.contrib.auth.models import User
from django.test import TestCase
from game.models import GuestGameRoom, ComputerGameRoom, RankingGameRoom, Game


class TestRankingGameRoomModel(TestCase):
    def test_ranking_game_room_signal_correct_setup_post_save(self):
        first_user = User.objects.create(username='first user')
        second_user = User.objects.create(username='second user')
        room = RankingGameRoom.objects.create(white_player=first_user, black_player=second_user)

        self.assertEqual(Game.objects.count(), 1)
        self.assertEqual(room.game, Game.objects.first())


class TestGuestGameRoomModel(TestCase):
    def test_guest_game_room_signal_correct_setup_post_save(self):
        room = GuestGameRoom.objects.create()

        self.assertEqual(Game.objects.count(), 1)
        self.assertEqual(room.game, Game.objects.first())
        self.assertEqual(len(room.white_player), 64)
        self.assertEqual(len(room.black_player), 64)


class TestComputerGameRoomModel(TestCase):
    def test_computer_game_room_signal_correct_setup_post_save(self):
        room = ComputerGameRoom.objects.create()

        self.assertEqual(Game.objects.count(), 1)
        self.assertEqual(room.game, Game.objects.first())
        self.assertEqual(len(room.player), 64)
