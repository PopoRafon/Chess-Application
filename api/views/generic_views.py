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
        count = 10
        count_param = self.request.GET.get('count')

        if count_param and count_param.isdigit():
            count_param_int = int(count_param)
            if count_param_int >= 1 and count_param_int <= 100:
                count = count_param_int

        return User.objects.select_related('profile').all().order_by('-profile__rating')[0:count]
