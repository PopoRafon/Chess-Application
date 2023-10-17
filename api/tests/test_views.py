from rest_framework.test import APITestCase
from api.models import Room
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from http.cookies import SimpleCookie


class TestPlayOnlineView(APITestCase):
    def setUp(self):
        self.room = Room.objects.create()
        self.first_user = User.objects.create(username='first user')
        self.second_user = User.objects.create(username='second user')
        self.room.players.add(self.first_user, self.second_user)

    def test_play_online_view_GET(self):
        url = reverse('play-online', kwargs={'id': self.room.hashed_url})
        response = self.client.get(url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_json['players'], [self.first_user.id, self.second_user.id])


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


class TestUserDataView(APITestCase):
    def setUp(self):
        self.url = reverse('user-data')

    def test_user_data_GET_authenticated_user(self):
        user = User.objects.create(username='user')
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = self.client.get(self.url, HTTP_AUTHORIZATION=f'Bearer {access}')
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_json['success'])
        self.assertEqual(len(response_json['success']), 2)

    def test_user_data_GET_unauthenticated_user(self):
        response = self.client.get(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 401)
        self.assertTrue(response_json['error'])


class TestRegisterView(APITestCase):
    def setUp(self):
        self.url = reverse('register')

    def test_register_view_POST_valid_data(self):
        response = self.client.post(self.url, data={
            'username': 'username',
            'email': 'email@example.com',
            'password1': 'password',
            'password2': 'password',
            'checkbox': True
        })
        response_json = response.json()

        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)
        self.assertTrue(response_json['success']['access'])
        self.assertIn('refresh', response.cookies)

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
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_json['success']['access'])
        self.assertIn('refresh', response.cookies)

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
    def test_logout_view_GET(self):
        url = reverse('logout')
        user = User.objects.create(username='user')
        token = RefreshToken.for_user(user)

        self.client.cookies = SimpleCookie({'refresh': token})
        response = self.client.get(url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response_json['success'])
        self.assertFalse(response.cookies['refresh'].value)
