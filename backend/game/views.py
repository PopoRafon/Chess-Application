import chess
from datetime import datetime
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from game.permissions import RankingGameRoomObjectPermissions, GuestGameRoomObjectPermissions, ComputerGameRoomObjectPermissions
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom
from game.serializers import (
    RankingGameRoomSerializer,
    GuestGameRoomSerializer,
    ComputerGameRoomRetrieveSerializer,
    ComputerGameRoomCreateSerializer
)


class RankingGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = RankingGameRoomSerializer
    permission_classes = [IsAuthenticated, RankingGameRoomObjectPermissions]

    def get_queryset(self):
        return RankingGameRoom.objects.select_related('game').all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        user = request.user

        response.data['player'] = 'w' if game_room_object.white_player == user else 'b'
        response.data['messages'] = [{'username': message.sender.username, 'body': message.body} for message in game_room_object.game.messages.all()]

        response.data['white_timer'] = round(game_room_object.game.white_timer.total_seconds())
        response.data['black_timer'] = round(game_room_object.game.black_timer.total_seconds())

        if game_room_object.game.last_move_timestamp and not game_room_object.game.result:
            last_move_player = 'white_last_move' if chess.Board(game_room_object.game.fen).turn else 'black_last_move'
            response.data[last_move_player] = round(datetime.timestamp(game_room_object.game.last_move_timestamp))

        return response


class GuestGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = GuestGameRoomSerializer
    permission_classes = [GuestGameRoomObjectPermissions]

    def get_queryset(self):
        return GuestGameRoom.objects.select_related('game').all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        token = request.COOKIES.get('guest_game_token')

        response.data['player'] = 'w' if game_room_object.white_player == token else 'b'

        response.data['white_timer'] = round(game_room_object.game.white_timer.total_seconds())
        response.data['black_timer'] = round(game_room_object.game.black_timer.total_seconds())

        if game_room_object.game.last_move_timestamp and not game_room_object.game.result:
            last_move_player = 'white_last_move' if chess.Board(game_room_object.game.fen).turn else 'black_last_move'
            response.data[last_move_player] = round(datetime.timestamp(game_room_object.game.last_move_timestamp))

        return response


class ComputerGameRoomRetrieveView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = ComputerGameRoomRetrieveSerializer
    permission_classes = [ComputerGameRoomObjectPermissions]

    def get_queryset(self):
        return ComputerGameRoom.objects.select_related('game').all()


class ComputerGameRoomCreateView(CreateAPIView):
    serializer_class = ComputerGameRoomCreateSerializer
