from datetime import timedelta
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMessage
from django.conf import settings
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
                    'email': request.user.email,
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


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = self.request.user
        data = request.data
        old_password = data.get('oldPassword')
        new_password1 = data.get('newPassword1')
        new_password2 = data.get('newPassword2')

        if user.check_password(old_password):
            if new_password1 == new_password2:
                user.set_password(new_password1)
                user.save()

                return Response({'success': 'Your password has been successfully changed!'})
            else:
                return Response({'newPassword2': 'Passwords must be the same.'})
        else:
            return Response({'oldPassword': 'Old password is incorrect.'})


class PasswordRecoveryView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            user = User.objects.get(email=email)

            base64_encoded_id = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)

            subject = 'Chess password reset'
            body = render_to_string('password_reset_email.html', {
                'domain': settings.BASE_DOMAIN,
                'uidb64': base64_encoded_id,
                'token': token,
                'username': user.username,
                'site_name': 'Chess'
            })

            EmailMessage(
                subject=subject,
                body=body,
                to=[email]
            ).send()

            return Response({'success': 'Link to reset password has been sent to your email address!'})
        except Exception:
            return Response({'email': 'Email address you provided was invalid.'})


class PasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            uidb64 = kwargs.get('uidb64')
            token = kwargs.get('token')
            id = urlsafe_base64_decode(uidb64).decode('utf-8')
            user = User.objects.get(id=id)
            is_token_valid = PasswordResetTokenGenerator().check_token(user, token)

            if is_token_valid:
                data = request.data
                new_password1 = data['newPassword1']
                new_password2 = data['newPassword2']

                if new_password1 == new_password2:
                    user.set_password(new_password1)
                    user.save()

                    return Response({'success': 'Your password has been successfully changed!'})
                else:
                    return Response({'newPassword2': 'Passwords must be the same.'})
            else:
                return Response({'token': 'Token you provided is invalid.'})
        except Exception:
            return Response({'user': "User you provided doesn't exist."})


class RankingView(ListAPIView):
    serializer_class = RankingSerializer

    def get_queryset(self):
        return User.objects.prefetch_related('profile').all().order_by('-profile__rating')[0:25]
