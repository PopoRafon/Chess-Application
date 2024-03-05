from django.contrib.auth.models import User
from django.test import TestCase
from user.models import Profile


class TestProfileModel(TestCase):
    def test_profile_created_post_user_creation(self):
        user = User.objects.create(username='user')

        self.assertEqual(Profile.objects.count(), 1)
        self.assertEqual(Profile.objects.get(user__username='user').user, user)
