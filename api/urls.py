from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import user_views, account_views, generic_views, password_views, game_room_views

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh', generic_views.TokenRefreshView.as_view(), name='token-refresh'),

    path('ranking', generic_views.RankingView.as_view(), name='ranking'),

    path('user/data', user_views.UserDataView.as_view(), name='user-data'),
    path('user/delete', user_views.UserDeleteView.as_view(), name='user-delete'),
    path('user/update', user_views.UserUpdateView.as_view(), name='user-update'),

    path('register', account_views.RegisterView.as_view(), name='register'),
    path('login', account_views.LoginView.as_view(), name='login'),
    path('logout', account_views.LogoutView.as_view(), name='logout'),

    path('password/change', password_views.PasswordChangeView.as_view(), name='password-change'),
    path('password/recovery', password_views.PasswordRecoveryView.as_view(), name='password-recovery'),
    path('password/reset/<uidb64>/<token>', password_views.PasswordResetView.as_view(), name='password-reset'),

    path('ranking/game/room/<id>', game_room_views.RankingGameRoomView.as_view(), name='ranking-game-room'),
    path('guest/game/room/<id>', game_room_views.GuestGameRoomView.as_view(), name='guest-game-room'),
    path('computer/game/room/<id>', game_room_views.ComputerGameRoomRetrieveView.as_view(), name='computer-game-room-retrieve'),
    path('computer/game/room', game_room_views.ComputerGameRoomCreateView.as_view(), name='computer-game-room-create'),
]
