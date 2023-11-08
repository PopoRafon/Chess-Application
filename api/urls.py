from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('user/data', views.UserDataView.as_view(), name='user-data'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('login', views.LoginView.as_view(), name='login'),
    path('logout', views.LogoutView.as_view(), name='logout'),
    path('ranking/game/room/<id>', views.RankingGameRoomView.as_view(), name='ranking-game-room'),
    path('guest/game/room/<id>', views.GuestGameRoomView.as_view(), name='guest-game-room'),
    path('computer/game/room/<id>', views.ComputerGameRoomRetrieveView.as_view(), name='computer-game-room-retrieve'),
    path('computer/game/room', views.ComputerGameRoomCreateView.as_view(), name='computer-game-room-create'),
    path('ranking', views.RankingView.as_view(), name='ranking')
]
