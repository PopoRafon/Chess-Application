from jwt import decode
from django.contrib.auth.models import User, AnonymousUser
from django.conf import settings
from rest_framework_simplejwt.tokens import UntypedToken
from channels.middleware import BaseMiddleware
from channels.consumer import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from .utils.cookies import get_cookie

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
            token = get_cookie(scope, 'access')

            UntypedToken(token)
        except Exception:
            scope['user'] = AnonymousUser()
        else:
            decoded_data = decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            scope['user'] = await get_user(decoded_data)

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))
