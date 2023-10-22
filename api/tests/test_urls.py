from rest_framework.test import APISimpleTestCase
from django.urls import resolve, reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from api.views import TokenRefreshView, UserDataView, RegisterView, LoginView, LogoutView, UserGameRoomView, GuestGameRoomView, ComputerGameRoomView


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


class TestGameRoomUrls(APISimpleTestCase):
    def test_user_game_room_url(self):
        url = reverse('user-game-room', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(resolver.func.view_class, UserGameRoomView)

    def test_guest_game_room_url(self):
        url = reverse('guest-game-room', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(resolver.func.view_class, GuestGameRoomView)

    def test_computer_game_room_url(self):
        url = reverse('computer-game-room', kwargs={'id': 1})
        resolver = resolve(url)

        self.assertEqual(resolver.func.view_class, ComputerGameRoomView)
