from django.urls import path
from .views import RankingGameRoomView, GuestGameRoomView, ComputerGameRoomRetrieveView, ComputerGameRoomCreateView

urlpatterns = [
    path('ranking/game/room/<id>', RankingGameRoomView.as_view(), name='ranking-game-room'),
    path('guest/game/room/<id>', GuestGameRoomView.as_view(), name='guest-game-room'),
    path('computer/game/room/<id>', ComputerGameRoomRetrieveView.as_view(), name='computer-game-room-retrieve'),
    path('computer/game/room', ComputerGameRoomCreateView.as_view(), name='computer-game-room-create'),
]
