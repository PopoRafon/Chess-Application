from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import UserGameRoom, GuestGameRoom, ComputerGameRoom


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


class UserGameRoomSerializer(serializers.ModelSerializer):
    white_player_username = serializers.CharField(source='white_player.username')
    black_player_username = serializers.CharField(source='black_player.username')

    class Meta:
        model = UserGameRoom
        fields = ['white_player_username', 'black_player_username', 'white_timer', 'black_timer', 'game_state', 'turn', 'result']


class GuestGameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestGameRoom
        fields = ['white_timer', 'black_timer', 'game_state', 'turn', 'result']


class ComputerGameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComputerGameRoom
        fields = ['game_state', 'turn', 'result']
