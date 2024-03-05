from django.urls import resolve, reverse
from rest_framework.test import APISimpleTestCase
from user.views import UserDataView, UserDeleteView, UserUpdateView, UserGamesHistoryView, RankingView


class TestUserUrls(APISimpleTestCase):
    def test_user_data_url(self):
        url = reverse('user-data')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/user/data')
        self.assertEqual(resolver.func.view_class, UserDataView)

    def test_user_delete_url(self):
        url = reverse('user-delete')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/user/delete')
        self.assertEqual(resolver.func.view_class, UserDeleteView)

    def test_user_update_url(self):
        url = reverse('user-update')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/user/update')
        self.assertEqual(resolver.func.view_class, UserUpdateView)

    def test_user_games_history_url(self):
        url = reverse('user-games-history')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/user/games/history')
        self.assertEqual(resolver.func.view_class, UserGamesHistoryView)

    def test_ranking_url(self):
        url = reverse('ranking')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/ranking')
        self.assertEqual(resolver.func.view_class, RankingView)
