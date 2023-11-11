from django.contrib import admin
from .models import Profile, RankingGameRoom, GuestGameRoom, ComputerGameRoom, Game, Move, Message


admin.site.register(Profile)
admin.site.register(RankingGameRoom)
admin.site.register(GuestGameRoom)
admin.site.register(ComputerGameRoom)
admin.site.register(Game)
admin.site.register(Move)
admin.site.register(Message)
