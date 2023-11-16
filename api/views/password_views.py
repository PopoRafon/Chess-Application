from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from api.serializers import PasswordChangeSerializer
from api.serializers import PasswordResetSerializer


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = self.request.user
        data = request.data
        serializer = PasswordChangeSerializer(data=data, context={'user': user})

        if serializer.is_valid():
            new_password = data.get('new_password1')

            user.set_password(new_password)
            user.save()

            return Response({'success': 'Your password has been successfully changed!'})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({'email': 'Email address you provided was invalid.'}, status=status.HTTP_400_BAD_REQUEST)


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
                serializer = PasswordResetSerializer(data=data)

                if serializer.is_valid():
                    new_password1 = data['new_password1']

                    user.set_password(new_password1)
                    user.save()

                    return Response({'success': 'Your password has been successfully changed!'})
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'token': 'Your token expired or is invalid.'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response({'error': 'Something went wrong.'}, status=status.HTTP_400_BAD_REQUEST)
