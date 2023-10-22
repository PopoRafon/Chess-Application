from django.urls import re_path
from .consumers import MatchmakingConsumer, GameConsumer


websocket_urlpatterns = [
    re_path(r'ws/matchmaking/$', MatchmakingConsumer.as_asgi()),
    re_path(r'ws/game/(?P<game>[0-9a-fA-F-]+)/$', GameConsumer.as_asgi())
]
