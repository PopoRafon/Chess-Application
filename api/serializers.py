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


class RankingGameRoomSerializer(serializers.ModelSerializer):
    positions = serializers.JSONField(source='game.positions')
    castling = serializers.CharField(source='game.castling')
    result = serializers.CharField(source='game.result')
    turn = serializers.CharField(source='game.turn')
    white_username = serializers.CharField(source='white_player.username')
    black_username = serializers.CharField(source='black_player.username')
    white_rating = serializers.IntegerField(source='white_player.profile.rating')
    black_rating = serializers.IntegerField(source='black_player.profile.rating')
    white_avatar = serializers.ImageField(source='white_player.profile.avatar')
    black_avatar = serializers.ImageField(source='black_player.profile.avatar')

    class Meta:
        model = RankingGameRoom
        exclude = ['id', 'game_started', 'black_player', 'white_player', 'game']


class GuestGameRoomSerializer(serializers.ModelSerializer):
    positions = serializers.JSONField(source='game.positions')
    castling = serializers.CharField(source='game.castling')
    result = serializers.CharField(source='game.result')
    turn = serializers.CharField(source='game.turn')

    class Meta:
        model = GuestGameRoom
        exclude = ['id', 'game_started', 'black_player', 'white_player', 'game']


class ComputerGameRoomRetrieveSerializer(serializers.ModelSerializer):
    positions = serializers.JSONField(source='game.positions')
    castling = serializers.CharField(source='game.castling')
    result = serializers.CharField(source='game.result')
    turn = serializers.CharField(source='game.turn')

    class Meta:
        model = ComputerGameRoom
        fields = ['positions', 'result', 'turn']


class ComputerGameRoomCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerGameRoom
        fields = ['id', 'player']
