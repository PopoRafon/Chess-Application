from datetime import timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, CreateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom
from .permissions import RankingGameRoomObjectPermissions, GuestGameRoomObjectPermissions, ComputerGameRoomObjectPermissions
from .serializers import (
    RegisterSerializer,
    RankingGameRoomSerializer,
    GuestGameRoomSerializer,
    ComputerGameRoomRetrieveSerializer,
    ComputerGameRoomCreateSerializer,
    RankingSerializer
)


class RankingGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = RankingGameRoomSerializer
    permission_classes = [IsAuthenticated, RankingGameRoomObjectPermissions]

    def get_queryset(self):
        return RankingGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        user = request.user

        response.data['player'] = 'w' if game_room_object.white_player == user else 'b'
        response.data['messages'] = [{'username': message.sender.username, 'body': message.body} for message in game_room_object.game.messages.all()]
        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class GuestGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = GuestGameRoomSerializer
    permission_classes = [GuestGameRoomObjectPermissions]

    def get_queryset(self):
        return GuestGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        token = request.COOKIES.get('guest_game_token')

        response.data['player'] = 'w' if game_room_object.white_player == token else 'b'
        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class ComputerGameRoomRetrieveView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = ComputerGameRoomRetrieveSerializer
    permission_classes = [ComputerGameRoomObjectPermissions]

    def get_queryset(self):
        return ComputerGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()

        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class ComputerGameRoomCreateView(CreateAPIView):
    serializer_class = ComputerGameRoomCreateSerializer


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

            response = Response({'success': 'Your account has been successfully created!'}, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='refresh',
                value=str(refresh),
                max_age=timedelta(days=7),
                httponly=True
            )

            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                max_age=timedelta(minutes=10)
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

            response = Response({'success': 'You have been successfully logged in to your account!'}, status=status.HTTP_200_OK)

            response.set_cookie(
                key='refresh',
                value=str(refresh),
                max_age=timedelta(days=7),
                httponly=True
            )

            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                max_age=timedelta(minutes=10)
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
        response.delete_cookie('access')

        return response


class RankingView(ListAPIView):
    serializer_class = RankingSerializer

    def get_queryset(self):
        return User.objects.prefetch_related('profile').all().order_by('-profile__rating')[0:25]
