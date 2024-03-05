from django.urls import path
from .views import RankingView, UserDataView, UserDeleteView, UserUpdateView, UserGamesHistoryView

urlpatterns = [
    path('ranking', RankingView.as_view(), name='ranking'),
    path('user/data', UserDataView.as_view(), name='user-data'),
    path('user/delete', UserDeleteView.as_view(), name='user-delete'),
    path('user/update', UserUpdateView.as_view(), name='user-update'),
    path('user/games/history', UserGamesHistoryView.as_view(), name='user-games-history'),
]
