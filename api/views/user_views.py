from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.serializers import UserUpdateSerializer


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
        user.delete()

        response = Response({'success': 'Your account has been successfully deleted!'})
        response.delete_cookie('refresh')
        response.delete_cookie('access')

        return response


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data
        serializer = UserUpdateSerializer(data=data)

        if serializer.is_valid():
            avatar = data.get('avatar', None)
            username = data.get('username', None)
            email = data.get('email', None)

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
