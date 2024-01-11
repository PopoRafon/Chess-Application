import chess
from datetime import datetime
from rest_framework.generics import RetrieveAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated
from api.permissions import RankingGameRoomObjectPermissions, GuestGameRoomObjectPermissions, ComputerGameRoomObjectPermissions
from api.models import RankingGameRoom, GuestGameRoom, ComputerGameRoom
from api.serializers import (
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
        return RankingGameRoom.objects.prefetch_related('game').all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        user = request.user
        game_moves = list(game_room_object.game.moves.all())

        response.data['player'] = 'w' if game_room_object.white_player == user else 'b'
        response.data['messages'] = [{'username': message.sender.username, 'body': message.body} for message in game_room_object.game.messages.all()]
        response.data['prevMoves'] = [[move.move, move.fen] for move in game_moves]

        response.data['white_timer'] = round(game_room_object.game.white_timer.total_seconds())
        response.data['black_timer'] = round(game_room_object.game.black_timer.total_seconds())

        if len(game_moves) >= 1 and not game_room_object.game.result:
            last_move_player = 'white_last_move' if chess.Board(game_room_object.game.fen).turn else 'black_last_move'
            response.data[last_move_player] = round(datetime.timestamp(game_moves[-1].timestamp))

        return response


class GuestGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = GuestGameRoomSerializer
    permission_classes = [GuestGameRoomObjectPermissions]

    def get_queryset(self):
        return GuestGameRoom.objects.prefetch_related('game', 'game__moves').all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        token = request.COOKIES.get('guest_game_token')
        game_moves = list(game_room_object.game.moves.all())

        response.data['player'] = 'w' if game_room_object.white_player == token else 'b'
        response.data['prevMoves'] = [[move.move, move.fen] for move in game_moves]

        response.data['white_timer'] = round(game_room_object.game.white_timer.total_seconds())
        response.data['black_timer'] = round(game_room_object.game.black_timer.total_seconds())

        if len(game_moves) >= 1 and not game_room_object.game.result:
            last_move_player = 'white_last_move' if chess.Board(game_room_object.game.fen).turn else 'black_last_move'
            response.data[last_move_player] = round(datetime.timestamp(game_moves[-1].timestamp))

        return response


class ComputerGameRoomRetrieveView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = ComputerGameRoomRetrieveSerializer
    permission_classes = [ComputerGameRoomObjectPermissions]

    def get_queryset(self):
        return ComputerGameRoom.objects.prefetch_related('game').all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        game_moves = list(game_room_object.game.moves.all())

        response.data['prevMoves'] = [[move.move, move.fen] for move in game_moves]

        return response


class ComputerGameRoomCreateView(CreateAPIView):
    serializer_class = ComputerGameRoomCreateSerializer
