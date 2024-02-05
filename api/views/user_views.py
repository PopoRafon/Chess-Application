from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.db.models import Q
from api.serializers import UserUpdateSerializer, UserGamesHistorySerializer
from api.models import RankingGameRoom


class UserDataView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'success': {
                    'avatar': request.user.profile.avatar.url,
                    'email': request.user.email,
                    'username': request.user.username,
                    'rating': request.user.profile.rating
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
        return RankingGameRoom.objects.order_by('-created').filter(
            Q(white_player=self.request.user) |
            Q(black_player=self.request.user)
        )[:5]
