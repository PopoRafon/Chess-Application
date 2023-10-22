from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from .serializers import RegisterSerializer, UserGameRoomSerializer, GuestGameRoomSerializer, ComputerGameRoomSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from .models import UserGameRoom, GuestGameRoom, ComputerGameRoom
from rest_framework.permissions import IsAuthenticated


class UserGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = UserGameRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserGameRoom.objects.all()

    def perform_authentication(self, request):
        user = request.user
        game_object = self.get_object()

        if game_object.white_player == user or game_object.black_player == user:
            return super().perform_authentication(request)
        else:
            return self.permission_denied(request, 'You are not authorized to access this game.')


class GuestGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = GuestGameRoomSerializer

    def get_queryset(self):
        return GuestGameRoom.objects.all()

    def perform_authentication(self, request):
        game_token = request.COOKIES.get('guest_game_token')
        game_object = self.get_object()

        if game_object.white_player == game_token or game_object.black_player == game_token:
            return super().perform_authentication(request)
        else:
            return self.permission_denied(request, 'Invalid game token provided.')


class ComputerGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = ComputerGameRoomSerializer

    def get_queryset(self):
        return ComputerGameRoom.objects.all()

    def perform_authentication(self, request):
        game_token = request.COOKIES.get('computer_game_token')
        game_object = self.get_object()

        if game_object.white_player == game_token or game_object.black_player == game_token:
            return super().perform_authentication(request)
        else:
            return self.permission_denied(request, 'Invalid game token provided.')


class TokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        request.data['refresh'] = refresh_token

        return super().post(request, *args, **kwargs)


class UserDataView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'success': {
                    'username': request.user.username,
                    'rating': request.user.profile.rating
                }
            })
        else:
            return Response({'error': 'You need to login.'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password1']

            user = User.objects.create_user(
                email=email,
                username=username,
                password=password
            )

            refresh = RefreshToken.for_user(user)

            response = Response({
                'success': {
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='refresh',
                value=str(refresh),
                max_age=timedelta(days=7),
                httponly=True
            )

            return response
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)

            response = Response({
                'success': {
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_200_OK)

            response.set_cookie(
                key='refresh',
                value=str(refresh),
                max_age=timedelta(days=7),
                httponly=True
            )

            return response
        else:
            return Response({
                'username': 'Provided credentials are incorrect.',
                'password': 'Provided credentials are incorrect.'
            }, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def get(self, request):
        response = Response({
            'success': 'You have been successfully log off your account.'
        }, status=status.HTTP_200_OK)

        response.delete_cookie('refresh')

        return response
