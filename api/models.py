from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta
import uuid

def default_game_state():
    return str([
        ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
    ])


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars/', null=True)
    rating = models.IntegerField(default=800)

    def __str__(self):
        return self.user.username


class UserGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_white')
    black_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_room_black')
    white_timer = models.DurationField(default=timedelta(minutes=10))
    black_timer = models.DurationField(default=timedelta(minutes=10))
    game_state = models.JSONField(blank=True, default=default_game_state)
    turn = models.CharField(max_length=1, blank=True, default='w')
    result = models.CharField(max_length=10, blank=True)
    game_started = models.BooleanField(default=False)


class GuestGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.CharField(max_length=64, blank=True)
    black_player = models.CharField(max_length=64, blank=True)
    white_timer = models.DurationField(default=timedelta(minutes=10))
    black_timer = models.DurationField(default=timedelta(minutes=10))
    game_state = models.JSONField(blank=True, default=default_game_state)
    turn = models.CharField(max_length=1, blank=True, default='w')
    result = models.CharField(max_length=10, blank=True)
    game_started = models.BooleanField(default=False)


class ComputerGameRoom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    white_player = models.CharField(max_length=64, blank=True)
    black_player = models.CharField(max_length=64, blank=True)
    game_state = models.JSONField(blank=True, default=default_game_state)
    turn = models.CharField(max_length=1, blank=True, default='w')
    result = models.CharField(max_length=10, blank=True)
    game_started = models.BooleanField(default=False)
