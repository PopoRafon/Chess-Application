import uuid
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from .utils import default_game_positions


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars/', null=True)
    rating = models.IntegerField(default=800)

    def __str__(self):
        return self.user.username


class Game(models.Model):
    positions = models.JSONField(blank=True, default=default_game_positions)
    castling = models.CharField(max_length=4, blank=True, default='KQkq')
    turn = models.CharField(max_length=1, blank=True, default='w')
    result = models.CharField(max_length=10, blank=True)


class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='moves')
    positions = models.JSONField()
    turn = models.CharField(max_length=1)
    move = models.CharField(max_length=10)


class RankingGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_white')
    black_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_black')
    white_timer = models.DurationField(default=timedelta(minutes=10))
    black_timer = models.DurationField(default=timedelta(minutes=10))
    game_started = models.BooleanField(default=False)
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)


class GuestGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.CharField(max_length=64, blank=True)
    black_player = models.CharField(max_length=64, blank=True)
    white_timer = models.DurationField(default=timedelta(minutes=10))
    black_timer = models.DurationField(default=timedelta(minutes=10))
    game_started = models.BooleanField(default=False)
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)


class ComputerGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player = models.CharField(max_length=64, blank=True)
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)
