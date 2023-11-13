from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom


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
        password1 = attrs['password1']
        password2 = attrs['password2']
        checkbox = attrs['checkbox']

        if password1 != password2:
            raise serializers.ValidationError({'password2': 'Passwords must be the same.'})

        if not checkbox:
            raise serializers.ValidationError({'checkbox': 'Terms of Service must be accepted.'})

        return attrs


class GameRoomSerializer(serializers.ModelSerializer):
    """
    Parent serializer for all Game Room Serializers.
    Provides all basic fields for game to work.
    """
    white_points = serializers.IntegerField(source='game.white_points')
    black_points = serializers.IntegerField(source='game.black_points')
    king_check = serializers.CharField(source='game.king_check')
    en_passant = serializers.CharField(source='game.en_passant')
    positions = serializers.JSONField(source='game.positions')
    castling = serializers.CharField(source='game.castling')
    result = serializers.CharField(source='game.result')
    turn = serializers.CharField(source='game.turn')


class RankingGameRoomSerializer(GameRoomSerializer):
    white_username = serializers.CharField(source='white_player.username')
    black_username = serializers.CharField(source='black_player.username')
    white_rating = serializers.IntegerField(source='white_player.profile.rating')
    black_rating = serializers.IntegerField(source='black_player.profile.rating')
    white_avatar = serializers.ImageField(source='white_player.profile.avatar')
    black_avatar = serializers.ImageField(source='black_player.profile.avatar')

    class Meta:
        model = RankingGameRoom
        exclude = ['id', 'game_started', 'black_player', 'white_player', 'game']


class GuestGameRoomSerializer(GameRoomSerializer):
    class Meta:
        model = GuestGameRoom
        exclude = ['id', 'game_started', 'black_player', 'white_player', 'game']


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

    class Meta:
        model = User
        fields = ['username', 'rating', 'avatar', 'wins', 'loses']
