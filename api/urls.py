from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('user/data', views.UserDataView.as_view(), name='user-data'),
    path('register', views.RegisterView.as_view(), name='register'),
    path('logout', views.LogoutView.as_view(), name='logout')
]
