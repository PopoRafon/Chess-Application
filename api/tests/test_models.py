from django.contrib.auth.models import User
from django.test import TestCase
from api.models import Profile, GuestGameRoom, ComputerGameRoom


class TestProfileModel(TestCase):
    def test_profile_created_post_user_creation(self):
        user = User.objects.create(username='user')

        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get(id=1).user, user)


class TestGuestGameRoomModel(TestCase):
    def test_room_correct_setup_post_guest_game_room_creation(self):
        room = GuestGameRoom.objects.create()

        self.assertEqual(len(room.white_player), 64)
        self.assertEqual(len(room.black_player), 64)


class TestComputerGameRoomModel(TestCase):
    def test_room_correct_setup_post_computer_game_room_creation(self):
        room = ComputerGameRoom.objects.create()

        self.assertEqual(len(room.player), 64)
