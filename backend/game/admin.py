from django.contrib import admin
from .models import RankingGameRoom, GuestGameRoom, ComputerGameRoom, Game, Message

admin.site.register(RankingGameRoom)
admin.site.register(GuestGameRoom)
admin.site.register(ComputerGameRoom)
admin.site.register(Game)
admin.site.register(Message)
