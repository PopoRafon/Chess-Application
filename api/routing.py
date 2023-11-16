from django.urls import re_path
from .consumers.room_consumers import RankingGameConsumer, GuestGameConsumer, ComputerGameConsumer
from .consumers.matchmaking_consumers import MatchmakingConsumer

websocket_urlpatterns = [
    re_path(r'ws/matchmaking/$', MatchmakingConsumer.as_asgi()),
    re_path(r'ws/ranking/game/(?P<game>[0-9a-fA-F-]+)/$', RankingGameConsumer.as_asgi()),
    re_path(r'ws/guest/game/(?P<game>[0-9a-fA-F-]+)/$', GuestGameConsumer.as_asgi()),
    re_path(r'ws/computer/game/(?P<game>[0-9a-fA-F-]+)/$', ComputerGameConsumer.as_asgi())
]
