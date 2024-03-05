import re
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import serializers
from game.models import RankingGameRoom


class UserUpdateSerializer(serializers.Serializer):
    avatar = serializers.ImageField(required=False)
    email = serializers.EmailField(
        required=False,
        min_length=8,
        max_length=64
    )
    username = serializers.CharField(
        required=False,
        min_length=8,
        max_length=16
    )

    def validate(self, attrs):
        user = self.context['user']
        avatar = attrs.get('avatar')
        email = attrs.get('email')
        username = attrs.get('username')

        if avatar:
            avatar_types = avatar.content_type.split('/')

            if avatar_types[0] not in settings.CONTENT_TYPES or avatar_types[1] not in settings.IMAGE_EXTENSIONS:
                raise serializers.ValidationError({'avatar': 'Avatar file must be an image with .jpg, .jpeg or .png format.'})

            if avatar.size > settings.MAX_UPLOAD_SIZE:
                raise serializers.ValidationError({'avatar': 'Avatar file size cannot be bigger than 5MB.'})

        if email:
            if email != user.email and User.objects.filter(email=email)[:1]:
                raise serializers.ValidationError({'email': 'User with that email address already exist.'})

        if username:
            if not re.search('^[a-zA-Z0-9]*$', username):
                raise serializers.ValidationError({'username': 'Username can only contain letters and numbers.'})

            if username != user.username and User.objects.filter(username=username)[:1]:
                raise serializers.ValidationError({'username': 'User with that username already exist.'})

        return attrs


class UserGamesHistorySerializer(serializers.ModelSerializer):
    white_player = serializers.CharField(source='white_player.username')
    black_player = serializers.CharField(source='black_player.username')
    result = serializers.CharField(source='game.result')

    class Meta:
        model = RankingGameRoom
        fields = ['white_player', 'black_player', 'result']


class RankingSerializer(serializers.ModelSerializer):
    rating = serializers.CharField(source='profile.rating')
    avatar = serializers.CharField(source='profile.avatar.url')
    wins = serializers.IntegerField(source='profile.wins')
    loses = serializers.IntegerField(source='profile.loses')
    draws = serializers.IntegerField(source='profile.draws')

    class Meta:
        model = User
        fields = ['username', 'rating', 'avatar', 'wins', 'loses', 'draws']
