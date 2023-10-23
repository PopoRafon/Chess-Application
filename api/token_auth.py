from channels.middleware import BaseMiddleware
from channels.consumer import database_sync_to_async
from django.contrib.auth.models import User, AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from channels.auth import AuthMiddlewareStack
from http.cookies import SimpleCookie
from django.conf import settings
from jwt import decode

@database_sync_to_async
def get_user(validated_token):
    try:
        user = User.objects.get(id=validated_token['user_id'])
        return user
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            token = SimpleCookie(dict(scope['headers']).get(b'cookie').decode('utf8')).get('access').value

            UntypedToken(token)
        except Exception:
            scope['user'] = AnonymousUser()
        else:
            decoded_data = decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            scope['user'] = await get_user(decoded_data)

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
