import hashlib, secrets
from django.dispatch import receiver
from django.db.models.signals import post_save
from game.models import GuestGameRoom, ComputerGameRoom, Game, RankingGameRoom
from game.utils.models import create_chess_pgn

@receiver(post_save, sender=RankingGameRoom)
def setup_ranking_game_room(sender, instance, created, **kwargs):
    if created:
        white_player = instance.white_player.username
        black_player = instance.black_player.username
        game = Game.objects.create()
        game.pgn = create_chess_pgn(white_player, black_player)
        game.save()

        instance.game = game

        instance.save()

@receiver(post_save, sender=GuestGameRoom)
def setup_guest_game_room(sender, instance, created, **kwargs):
    if created:
        white_player = hashlib.sha256(f'{secrets.token_hex(32)}{instance.id}'.encode('utf-8')).hexdigest()
        black_player = hashlib.sha256(f'{secrets.token_hex(32)}{instance.id}'.encode('utf-8')).hexdigest()
        game = Game.objects.create()
        game.pgn = create_chess_pgn("Guest", "Guest")
        game.save()

        instance.white_player = white_player
        instance.black_player = black_player
        instance.game = game

        instance.save()

@receiver(post_save, sender=ComputerGameRoom)
def setup_computer_game_room(sender, instance, created, **kwargs):
    if created:
        player = hashlib.sha256(f'{secrets.token_hex(32)}{instance.id}'.encode('utf-8')).hexdigest()
        game = Game.objects.create()
        game.pgn = create_chess_pgn("Player", "Bot")
        game.save()

        instance.player = player
        instance.game = game

        instance.save()
