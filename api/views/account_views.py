from datetime import timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.serializers import RegisterSerializer


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
    def post(self, request):
        response = Response({
            'success': 'You have been successfully logged out of your account!'
        }, status=status.HTTP_200_OK)

        response.delete_cookie('refresh')
        response.delete_cookie('access')

        return response
