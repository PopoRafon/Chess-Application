from django.urls import resolve, reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.test import APISimpleTestCase
from auth.views import PasswordChangeView, PasswordResetView, PasswordResetConfirmView, RegisterView, LoginView, LogoutView, TokenRefreshView


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
