import hashlib
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.models import Profile, GuestGameRoom, ComputerGameRoom, Game, RankingGameRoom

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
        game = Game.objects.create()
        game.save()

        instance.white_player = white_player
        instance.black_player = black_player
        instance.game = game

        instance.save()

@receiver(post_save, sender=ComputerGameRoom)
def setup_computer_game_room(sender, instance, created, **kwargs):
    if created:
        player = hashlib.sha256(f'computer_game_room_player_{instance.id}'.encode('utf-8')).hexdigest()
        game = Game.objects.create()
        game.save()

        instance.player = player
        instance.game = game

        instance.save()

@receiver(post_save, sender=RankingGameRoom)
def setup_ranking_game_room(sender, instance, created, **kwargs):
    if created:
        game = Game.objects.create()
        game.save()

        instance.game = game

        instance.save()
