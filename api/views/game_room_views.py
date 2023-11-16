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
        return RankingGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        user = request.user

        response.data['player'] = 'w' if game_room_object.white_player == user else 'b'
        response.data['messages'] = [{'username': message.sender.username, 'body': message.body} for message in game_room_object.game.messages.all()]
        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class GuestGameRoomView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = GuestGameRoomSerializer
    permission_classes = [GuestGameRoomObjectPermissions]

    def get_queryset(self):
        return GuestGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()
        token = request.COOKIES.get('guest_game_token')

        response.data['player'] = 'w' if game_room_object.white_player == token else 'b'
        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class ComputerGameRoomRetrieveView(RetrieveAPIView):
    lookup_url_kwarg = 'id'
    serializer_class = ComputerGameRoomRetrieveSerializer
    permission_classes = [ComputerGameRoomObjectPermissions]

    def get_queryset(self):
        return ComputerGameRoom.objects.all()

    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        game_room_object = self.get_object()

        response.data['prevMoves'] = [[move.move, move.positions, [move.old_pos, move.new_pos]] for move in game_room_object.game.moves.all()]

        return response


class ComputerGameRoomCreateView(CreateAPIView):
    serializer_class = ComputerGameRoomCreateSerializer
