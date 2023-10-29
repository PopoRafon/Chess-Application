from rest_framework.permissions import BasePermission


class RankingGameRoomObjectPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        if obj.white_player == user or obj.black_player == user:
            return True

        return False


class GuestGameRoomObjectPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        token = request.COOKIES.get('guest_game_token')

        if obj.white_player == token or obj.black_player == token:
            return True

        return False


class ComputerGameRoomObjectPermissions(BasePermission):
    def has_object_permission(self, request, view, obj):
        token = request.COOKIES.get('computer_game_token')

        if obj.player == token:
            return True

        return False
