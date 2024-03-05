from http.cookies import SimpleCookie
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase


class TestRegisterView(APITestCase):
    def setUp(self):
        self.url = reverse('register')

    def test_register_view_POST_valid_data(self):
        response = self.client.post(self.url, data={
            'username': 'username',
            'email': 'email@example.com',
            'password1': 'testpassword',
            'password2': 'testpassword',
            'checkbox': True
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)
        self.assertIn('refresh', response.cookies)
        self.assertIn('access', response.cookies)

    def test_register_view_POST_invalid_data(self):
        response = self.client.post(self.url, data={
            'username': '',
            'email': '',
            'password1': '',
            'password2': '',
            'checkbox': False
        })
        response_json = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response_json), 4)
        self.assertFalse(response.cookies)


class TestLoginView(APITestCase):
    def setUp(self):
        self.url = reverse('login')
        self.user = User.objects.create_user(username='username', password='password')

    def test_login_view_POST_valid_data(self):
        response = self.client.post(self.url, data={
            'username': 'username',
            'password': 'password'
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('refresh', response.cookies)
        self.assertIn('access', response.cookies)

    def test_login_view_POST_invalid_data(self):
        response = self.client.post(self.url, data={
            'username': '',
            'password': ''
        })
        response_json = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(len(response_json), 2)
        self.assertFalse(response.cookies)


class TestLogoutView(APITestCase):
    def test_logout_view_POST(self):
        url = reverse('logout')
        user = User.objects.create(username='user')
        token = RefreshToken.for_user(user)

        self.client.cookies = SimpleCookie({'refresh': token})
        response = self.client.post(url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_json['success'])
        self.assertFalse(response.cookies['refresh'].value)


class TestPasswordChangeView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='username', password='testpassword')
        self.url = reverse('password-change')
        self.valid_payload = {'old_password': 'testpassword', 'new_password1': 'newtestpassword', 'new_password2': 'newtestpassword'}
        self.refresh = RefreshToken.for_user(self.user)
        self.access = self.refresh.access_token

    def test_password_change_view_PATCH_authenticated_user_valid_data(self):
        response = self.client.patch(self.url, data=self.valid_payload, HTTP_AUTHORIZATION=f'Bearer {self.access}')

        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.first().check_password('newtestpassword'))

    def test_password_change_view_PATCH_unauthenticated_user(self):
        response = self.client.patch(self.url, data=self.valid_payload)

        self.assertEqual(response.status_code, 401)
        self.assertTrue(User.objects.first().check_password('testpassword'))

    def test_password_change_view_PATCH_invalid_data(self):
        invalid_payload = {'old_password': 'invalidoldpassword', 'new_password1': 'newtestpassword', 'new_password2': 'newtestpassword'}
        response = self.client.patch(self.url, data=invalid_payload, HTTP_AUTHORIZATION=f'Bearer {self.access}')

        self.assertEqual(response.status_code, 400)
        self.assertTrue(User.objects.first().check_password('testpassword'))


class TestPasswordResetView(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='user', email='email@example.com')
        self.url = reverse('password-reset')

    def test_password_reset_view_POST_valid_data(self):
        response = self.client.post(self.url, data={'email': self.user.email})

        self.assertEqual(response.status_code, 200)

    def test_password_reset_view_POST_invalid_data(self):
        response = self.client.post(self.url, data={'email': 'email'})

        self.assertEqual(response.status_code, 400)


class TestPasswordResetConfirmView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='testpassword')
        self.token = PasswordResetTokenGenerator().make_token(self.user)
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.id))
        self.url = reverse('password-reset-confirm', kwargs={'uidb64': self.uidb64, 'token': self.token})
        self.valid_payload = {'new_password1': 'newtestpassword', 'new_password2': 'newtestpassword'}

    def test_password_reset_confirm_view_POST_valid_token_valid_data(self):
        response = self.client.post(self.url, data=self.valid_payload)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.first().check_password('newtestpassword'))

    def test_password_reset_confirm_view_POST_invalid_data(self):
        invalid_payload = {'new_password1': 'password', 'new_password2': 'password'}
        response = self.client.post(self.url, data=invalid_payload)

        self.assertEqual(response.status_code, 400)
        self.assertTrue(User.objects.first().check_password('testpassword'))

    def test_password_reset_confirm_view_POST_invalid_token(self):
        new_url = reverse('password-reset-confirm', kwargs={'uidb64': self.uidb64, 'token': 'token'})
        response = self.client.post(new_url, data=self.valid_payload)

        self.assertEqual(response.status_code, 401)
        self.assertTrue(User.objects.first().check_password('testpassword'))


class TestTokenRefreshView(APITestCase):
    def setUp(self):
        self.url = reverse('token-refresh')

    def test_token_refresh_view_POST_valid_data(self):
        user = User.objects.create(username='user')
        token = RefreshToken.for_user(user)

        self.client.cookies = SimpleCookie({'refresh': token})
        response = self.client.post(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_json['access'])

    def test_token_refresh_view_POST_invalid_data(self):
        response = self.client.post(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 400)
        self.assertTrue(response_json['refresh'])
