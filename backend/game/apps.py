from django.apps import AppConfig


class GameConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'game'
    label = 'chess_game'
    verbose_name = 'Game Management'

    def ready(self):
        import game.signals.handlers
