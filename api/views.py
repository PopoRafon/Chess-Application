from rest_framework.views import APIView
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta


class UserData(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'success': {
                    'username': request.user.username
                }
            })
        else:
            return Response({
                'error': 'You need to login.'
            }, status=status.HTTP_401_UNAUTHORIZED)


class Register(APIView):
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
