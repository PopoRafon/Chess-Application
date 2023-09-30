from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(default='avatar.png', upload_to='avatars/', null=True)
    points = models.IntegerField(default=800)

    def __str__(self):
        return self.user.username
