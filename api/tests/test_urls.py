from django.urls import resolve, reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.test import APISimpleTestCase
from api.views.game_room_views import RankingGameRoomView, GuestGameRoomView, ComputerGameRoomRetrieveView, ComputerGameRoomCreateView
from api.views.password_views import PasswordChangeView, PasswordResetView, PasswordResetConfirmView
from api.views.user_views import UserDataView, UserDeleteView, UserUpdateView
from api.views.account_views import RegisterView, LoginView, LogoutView
from api.views.generic_views import RankingView, TokenRefreshView


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


class TestRankingUrls(APISimpleTestCase):
    def test_ranking_url(self):
        url = reverse('ranking')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/ranking')
        self.assertEqual(resolver.func.view_class, RankingView)


class TestPasswordUrls(APISimpleTestCase):
    def test_password_change_url(self):
        url = reverse('password-change')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/password/change')
        self.assertEqual(resolver.func.view_class, PasswordChangeView)

    def test_password_reset_url(self):
        url = reverse('password-reset')
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/password/reset')
        self.assertEqual(resolver.func.view_class, PasswordResetView)

    def test_password_reset_confirm_url(self):
        url = reverse('password-reset-confirm', kwargs={'uidb64': 'uidb64', 'token': 'token'})
        resolver = resolve(url)

        self.assertEqual(url, '/api/v1/password/reset/confirm/uidb64/token')
        self.assertEqual(resolver.func.view_class, PasswordResetConfirmView)
