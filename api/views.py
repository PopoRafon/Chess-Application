from rest_framework.views import APIView
from .serializers import RegisterSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login


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

            login(request, user)

            return Response({'success': 'Account has been successfuly created.'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
