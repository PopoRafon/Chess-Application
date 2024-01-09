import uuid
import chess
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import User
from .utils import create_avatar_name


class Profile(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, db_index=True)
    avatar = models.ImageField(default='avatar.png', upload_to=create_avatar_name, null=True)
    rating = models.IntegerField(default=800)
    wins = models.IntegerField(blank=True, default=0)
    loses = models.IntegerField(blank=True, default=0)
    draws = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.user.username


class Game(models.Model):
    white_points = models.IntegerField(blank=True, default=0)
    black_points = models.IntegerField(blank=True, default=0)
    white_timer = models.DurationField(default=timedelta(minutes=10), blank=True)
    black_timer = models.DurationField(default=timedelta(minutes=10), blank=True)
    fen = models.CharField(max_length=90, default=chess.STARTING_FEN)
    result = models.CharField(max_length=40, blank=True)
    started = models.BooleanField(default=False)


class Message(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    body = models.CharField(max_length=255)


class Move(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='moves')
    fen = models.CharField(max_length=90)
    timestamp = models.DateTimeField(auto_now_add=True)
    move = models.CharField(max_length=10)


class RankingGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_white')
    black_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_black')
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.id

class GuestGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.CharField(max_length=64, blank=True)
    black_player = models.CharField(max_length=64, blank=True)
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.id

class ComputerGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    player = models.CharField(max_length=64, blank=True)
    game = models.OneToOneField(Game, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.id
