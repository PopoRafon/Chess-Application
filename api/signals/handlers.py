from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from api.models import Profile, GuestGameRoom, ComputerGameRoom
import hashlib

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)
        profile.save()

@receiver(post_save, sender=GuestGameRoom)
def setup_guest_game_room(sender, instance, created, **kwargs):
    if created:
        white_player = hashlib.sha256(f'guest_game_room_white_player_{instance.id}'.encode('utf-8')).hexdigest()
        black_player = hashlib.sha256(f'guest_game_room_black_player_{instance.id}'.encode('utf-8')).hexdigest()

        instance.white_player = white_player
        instance.black_player = black_player

        instance.save()

@receiver(post_save, sender=ComputerGameRoom)
def setup_computer_game_room(sender, instance, created, **kwargs):
    if created:
        white_player = hashlib.sha256(f'guest_game_room_white_player_{instance.id}'.encode('utf-8')).hexdigest()

        instance.white_player = white_player

        instance.save()
