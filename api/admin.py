from django.contrib import admin
from .models import Profile, UserGameRoom, GuestGameRoom, ComputerGameRoom


admin.site.register(Profile)
admin.site.register(UserGameRoom)
admin.site.register(GuestGameRoom)
admin.site.register(ComputerGameRoom)
