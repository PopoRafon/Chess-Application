from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from api.serializers import RankingSerializer


class TokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh')
        request.data['refresh'] = refresh_token

        return super().post(request, *args, **kwargs)


class RankingView(ListAPIView):
    serializer_class = RankingSerializer

    def get_queryset(self):
        return User.objects.prefetch_related('profile').all().order_by('-profile__rating')[0:25]
