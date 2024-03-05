from django.db import models
from django.contrib.auth.models import User
from .utils.models import create_avatar_name


class Profile(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE, db_index=True)
    avatar = models.ImageField(default='avatar.png', upload_to=create_avatar_name, null=True)
    rating = models.IntegerField(default=800)
    wins = models.IntegerField(blank=True, default=0)
    loses = models.IntegerField(blank=True, default=0)
    draws = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.user.username
