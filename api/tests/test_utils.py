from django.test import TestCase
from api.utils.cookies import get_cookie


class TestGetCookieUtil(TestCase):
    def test_get_cookie_valid_cookie(self):
        scope = {'headers': [(b'cookie', b'test_cookie=test_value')]}
        cookie = get_cookie(scope, 'test_cookie')

        self.assertEqual(cookie, 'test_value')

    def test_get_cookie_invalid_cookie(self):
        scope = {'headers': [(b'cookie', b'test_cookie=test_value')]}
        cookie = get_cookie(scope, 'test')

        self.assertEqual(cookie, '')
