from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import TokenRefreshView, RegisterView, LoginView, LogoutView, PasswordChangeView, PasswordResetView, PasswordResetConfirmView

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token-refresh'),

    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),

    path('password/change', PasswordChangeView.as_view(), name='password-change'),
    path('password/reset', PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/<uidb64>/<token>', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
