from rest_framework import serializers
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom


class GameRoomSerializer(serializers.ModelSerializer):
    """
    Parent serializer for all Game Room Serializers.
    Provides all basic fields for game to work.
    """
    white_points = serializers.IntegerField(source='game.white_points')
    black_points = serializers.IntegerField(source='game.black_points')
    result = serializers.CharField(source='game.result')
    pgn = serializers.CharField(source='game.pgn')


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
