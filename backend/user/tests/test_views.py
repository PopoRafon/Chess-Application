from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase


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
        self.assertEqual(len(response_json['success']), 7)

    def test_user_data_GET_unauthenticated_user(self):
        response = self.client.get(self.url)
        response_json = response.json()

        self.assertEqual(response.status_code, 401)
        self.assertTrue(response_json['error'])


class TestRankingView(APITestCase):
    def test_ranking_view_GET(self):
        url = reverse('ranking')
        User.objects.create(username='user')

        response = self.client.get(url)
        response_json = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response_json), 1)
        self.assertEqual(len(response_json[0]), 6)


class TestUserDeleteView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='user', password='password')
        self.url = reverse('user-delete')
        self.refresh = RefreshToken.for_user(self.user)
        self.access = self.refresh.access_token

    def test_user_delete_view_DELETE_authenticated_user(self):
        response = self.client.delete(self.url, {'password': 'password'}, HTTP_AUTHORIZATION=f'Bearer {self.access}')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.count(), 0)

    def test_user_delete_view_DELETE_unauthenticated_user(self):
        response = self.client.delete(self.url)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(User.objects.count(), 1)

    def test_user_delete_view_DELETE_invalid_data(self):
        response = self.client.delete(self.url, {'password': 'invalidpassword'}, HTTP_AUTHORIZATION=f'Bearer {self.access}')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.count(), 1)


class TestUserUpdateView(APITestCase):
    def setUp(self):
        self.user = User.objects.create(username='username', email='email@example.com')
        self.url = reverse('user-update')
        self.refresh = RefreshToken.for_user(self.user)
        self.access = self.refresh.access_token
        self.valid_payload = {'username': 'newusername', 'email': 'newemail@example.com'}

    def test_user_update_view_PATCH_authenticated_user_valid_data(self):
        response = self.client.patch(self.url, HTTP_AUTHORIZATION=f'Bearer {self.access}', data=self.valid_payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.first().username, 'newusername')
        self.assertEqual(User.objects.first().email, 'newemail@example.com')

    def test_user_update_view_PATCH_unauthenticated_user(self):
        response = self.client.patch(self.url, data=self.valid_payload)

        self.assertEqual(response.status_code, 401)
        self.assertEqual(User.objects.first().username, 'username')
        self.assertEqual(User.objects.first().email, 'email@example.com')

    def test_user_update_view_PATCH_invalid_data(self):
        invalid_payload = {'username': 'user', 'email': 'email'}
        response = self.client.patch(self.url, HTTP_AUTHORIZATION=f'Bearer {self.access}', data=invalid_payload)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(User.objects.first().username, 'username')
        self.assertEqual(User.objects.first().email, 'email@example.com')
