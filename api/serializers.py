import re
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=True,
        min_length=8,
        max_length=64,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    username = serializers.CharField(
        required=True,
        min_length=8,
        max_length=16,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password1 = serializers.CharField(
        required=True,
        min_length=8,
    )
    password2 = serializers.CharField(
        required=True,
        min_length=8
    )
    checkbox = serializers.BooleanField(
        required=True
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password1 = attrs.get('password1')
        password2 = attrs.get('password2')
        checkbox = attrs.get('checkbox')

        if not re.search('^[a-zA-Z0-9]*$', username):
            raise serializers.ValidationError({'username': 'Username can only contain letters and numbers.'})

        if password1 != password2:
            raise serializers.ValidationError({'password2': 'Passwords must be the same.'})

        if validate_password(password1):
            raise serializers.ValidationError({'password1': 'Password is invalid.'})

        if not checkbox:
            raise serializers.ValidationError({'checkbox': 'Terms of Service must be accepted.'})

        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        new_password1 = attrs.get('new_password1')
        new_password2 = attrs.get('new_password2')

        if new_password1 != new_password2:
            raise serializers.ValidationError({'new_password2': 'New passwords must be the same.'})

        if validate_password(new_password1):
            raise serializers.ValidationError({'new_password1': 'New password is invalid.'})

        return attrs


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        user = self.context['user']
        old_password = attrs.get('old_password')
        new_password1 = attrs.get('new_password1')
        new_password2 = attrs.get('new_password2')

        if not user.check_password(old_password):
            raise serializers.ValidationError({'old_password': 'Old password is incorrect.'})

        if new_password1 != new_password2:
            raise serializers.ValidationError({'new_password2': 'New passwords must be the same.'})

        if validate_password(new_password1):
            raise serializers.ValidationError({'new_password1': 'New password is invalid.'})

        return attrs


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


class GameRoomSerializer(serializers.ModelSerializer):
    """
    Parent serializer for all Game Room Serializers.
    Provides all basic fields for game to work.
    """
    white_points = serializers.IntegerField(source='game.white_points')
    black_points = serializers.IntegerField(source='game.black_points')
    result = serializers.CharField(source='game.result')
    fen = serializers.CharField(source='game.fen')


class RankingGameRoomSerializer(GameRoomSerializer):
    white_username = serializers.CharField(source='white_player.username')
    black_username = serializers.CharField(source='black_player.username')
    white_rating = serializers.IntegerField(source='white_player.profile.rating')
    black_rating = serializers.IntegerField(source='black_player.profile.rating')
    white_avatar = serializers.CharField(source='white_player.profile.avatar.url')
    black_avatar = serializers.CharField(source='black_player.profile.avatar.url')

    class Meta:
        model = RankingGameRoom
        exclude = ['id', 'black_player', 'white_player', 'game']


class GuestGameRoomSerializer(GameRoomSerializer):
    class Meta:
        model = GuestGameRoom
        exclude = ['id', 'black_player', 'white_player', 'game']


class ComputerGameRoomRetrieveSerializer(GameRoomSerializer):
    class Meta:
        model = ComputerGameRoom
        exclude = ['id', 'player', 'game']


class ComputerGameRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerGameRoom
        fields = ['id', 'player']


class RankingSerializer(serializers.ModelSerializer):
    rating = serializers.CharField(source='profile.rating')
    avatar = serializers.CharField(source='profile.avatar.url')
    wins = serializers.IntegerField(source='profile.wins')
    loses = serializers.IntegerField(source='profile.loses')
    draws = serializers.IntegerField(source='profile.draws')

    class Meta:
        model = User
        fields = ['username', 'rating', 'avatar', 'wins', 'loses', 'draws']
