from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from .serializers import RankingSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q
from .serializers import UserUpdateSerializer, UserGamesHistorySerializer
from game.models import RankingGameRoom


class UserDataView(APIView):
    def get(self, request):
        user = request.user

        if user.is_authenticated:
            return Response({
                'success': {
                    'avatar': user.profile.avatar.url,
                    'email': user.email,
                    'username': user.username,
                    'rating': user.profile.rating,
                    'wins': user.profile.wins,
                    'draws': user.profile.draws,
                    'loses': user.profile.loses
                }
            })
        else:
            return Response({'error': 'You need to login.'}, status=status.HTTP_401_UNAUTHORIZED)


class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        data = request.data
        password = data.get('password')

        if user.check_password(password):
            user.delete()

            response = Response({'success': 'Your account has been successfully deleted!'})
            response.delete_cookie('refresh')
            response.delete_cookie('access')

            return response
        else:
            return Response({'password': 'Provided password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        serializer = UserUpdateSerializer(data=data, context={'user': user})

        if serializer.is_valid():
            avatar = data.get('avatar')
            username = data.get('username')
            email = data.get('email')

            if avatar:
                user.profile.avatar = avatar
                user.profile.save()
            if username:
                user.username = username
            if email:
                user.email = email

            user.save()

            return Response({'success': 'Your account information has been successfully changed!'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserGamesHistoryView(ListAPIView):
    serializer_class = UserGamesHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RankingGameRoom.objects.select_related('game').order_by('-created').exclude(game__result='').filter(
            Q(white_player=self.request.user) |
            Q(black_player=self.request.user)
        )[:5]


class RankingView(ListAPIView):
    serializer_class = RankingSerializer

    def get_queryset(self):
        count = 10
        count_param = self.request.GET.get('count')

        if count_param and count_param.isdigit():
            count_param_int = int(count_param)
            if count_param_int >= 1 and count_param_int <= 100:
                count = count_param_int

        return User.objects.select_related('profile').all().order_by('-profile__rating')[0:count]
