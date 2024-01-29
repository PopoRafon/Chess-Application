import json
from unittest.mock import AsyncMock
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from api.utils.cookies import get_cookie
from api.utils.consumers import MatchmakingQueue
from api.models import Profile


class TestGetCookieUtil(TestCase):
    def test_get_cookie_valid_cookie(self):
        scope = {'headers': [(b'cookie', b'test_cookie=test_value')]}
        cookie = get_cookie(scope, 'test_cookie')

        self.assertEqual(cookie, 'test_value')

    def test_get_cookie_invalid_cookie(self):
        scope = {'headers': [(b'cookie', b'test_cookie=test_value')]}
        cookie = get_cookie(scope, 'test')

        self.assertEqual(cookie, '')


class TestMatchmakingUtil(TransactionTestCase):
    def setUp(self):
        self.first_consumer = AsyncMock()
        self.second_consumer = AsyncMock()

    async def test_check_ranking_queue_users_within_same_rating_range_receive_game_url(self):
        self.first_consumer.user = await database_sync_to_async(User.objects.create)(username='first user')
        self.first_consumer.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.first_consumer.user)
        self.second_consumer.user = await database_sync_to_async(User.objects.create)(username='second user')
        self.second_consumer.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.second_consumer.user)

        await MatchmakingQueue.add_to_ranking_queue(self.first_consumer)
        await MatchmakingQueue.add_to_ranking_queue(self.second_consumer)
        await MatchmakingQueue.check_ranking_queue()

        self.first_consumer.send.assert_called_once()
        self.second_consumer.send.assert_called_once()

        first_consumer_response = json.loads(self.first_consumer.send.call_args[0][0])
        second_consumer_response = json.loads(self.second_consumer.send.call_args[0][0])

        self.assertTrue(first_consumer_response.get('url'))
        self.assertTrue(second_consumer_response.get('url'))
        self.assertEqual(first_consumer_response.get('url'), second_consumer_response.get('url'))

        await MatchmakingQueue.remove_from_queue(self.first_consumer)
        await MatchmakingQueue.remove_from_queue(self.second_consumer)

    async def test_check_ranking_queue_users_with_too_big_rating_range_receive_nothing(self):
        self.first_consumer.user = await database_sync_to_async(User.objects.create)(username='first user')
        self.first_consumer.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.first_consumer.user)
        self.first_consumer.user_profile.rating = 1300
        self.second_consumer.user = await database_sync_to_async(User.objects.create)(username='second user')
        self.second_consumer.user_profile = await database_sync_to_async(Profile.objects.get)(user=self.second_consumer.user)

        await MatchmakingQueue.add_to_ranking_queue(self.first_consumer)
        await MatchmakingQueue.add_to_ranking_queue(self.second_consumer)
        await MatchmakingQueue.check_ranking_queue()

        self.first_consumer.send.assert_not_called()
        self.second_consumer.send.assert_not_called()

        await MatchmakingQueue.remove_from_queue(self.first_consumer)
        await MatchmakingQueue.remove_from_queue(self.second_consumer)

    async def test_check_guest_queue_receive_game_url_with_game_token(self):
        self.first_consumer.user.is_authenticated = False
        self.second_consumer.user.is_authenticated = False

        await MatchmakingQueue.add_to_guest_queue(self.first_consumer)
        await MatchmakingQueue.add_to_guest_queue(self.second_consumer)
        await MatchmakingQueue.check_guest_queue()

        self.first_consumer.send.assert_called_once()
        self.second_consumer.send.assert_called_once()
