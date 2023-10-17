from rest_framework.test import APISimpleTestCase
from django.urls import resolve, reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.views import TokenRefreshView, UserDataView, RegisterView, LoginView, LogoutView, PlayOnlineView


class TestTokenUrls(APISimpleTestCase):
    def test_token_url(self):
        url = reverse('token-obtain-pair')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/token')
        self.assertEqual(resolver.func.view_class, TokenObtainPairView)

    def test_token_refresh_url(self):
        url = reverse('token-refresh')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/token/refresh')
        self.assertEqual(resolver.func.view_class, TokenRefreshView)


class TestUserUrls(APISimpleTestCase):
    def test_user_data_url(self):
        url = reverse('user-data')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/user/data')
        self.assertEqual(resolver.func.view_class, UserDataView)


class TestUserAuthenticationUrls(APISimpleTestCase):
    def test_register_url(self):
        url = reverse('register')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/register')
        self.assertEqual(resolver.func.view_class, RegisterView)

    def test_login_url(self):
        url = reverse('login')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/login')
        self.assertEqual(resolver.func.view_class, LoginView)

    def test_logout_url(self):
        url = reverse('logout')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/logout')
        self.assertEqual(resolver.func.view_class, LogoutView)


class TestPlayUrls(APISimpleTestCase):
    def test_play_online_url(self):
        url = reverse('play-online', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/play/online/1')
        self.assertEqual(resolver.func.view_class, PlayOnlineView)
