from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars/', null=True)
    rating = models.IntegerField(default=800)

    def __str__(self):
        return self.user.username


class Room(models.Model):
    players = models.ManyToManyField(User, related_name='rooms')
    hashed_url = models.CharField(max_length=255, blank=True)


class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    body = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.sender.username}: {self.body}'
