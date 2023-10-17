from django.test import TestCase
from django.contrib.auth.models import User
from api.models import Profile, Room


class TestProfileModel(TestCase):
    def test_profile_created_post_user_creation(self):
        user = User.objects.create(username='user')

        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get(id=1).user, user)


class TestRoomModel(TestCase):
    def test_hashed_url_created_post_room_creation(self):
        room = Room.objects.create()

        self.assertTrue(room.hashed_url)
        self.assertEqual(len(room.hashed_url), 64)
