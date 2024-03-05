# Generated by Django 4.2.1 on 2024-03-05 01:28

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('white_points', models.IntegerField(blank=True, default=0)),
                ('black_points', models.IntegerField(blank=True, default=0)),
                ('white_timer', models.DurationField(blank=True, default=datetime.timedelta(seconds=600))),
                ('black_timer', models.DurationField(blank=True, default=datetime.timedelta(seconds=600))),
                ('fen', models.CharField(default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', max_length=90)),
                ('pgn', models.TextField(blank=True, max_length=1024, null=True)),
                ('last_move_timestamp', models.DateTimeField(blank=True, null=True)),
                ('result', models.CharField(blank=True, max_length=40)),
                ('started', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='RankingGameRoom',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('black_player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_room_black', to=settings.AUTH_USER_MODEL)),
                ('game', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chess_game.game')),
                ('white_player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='game_room_white', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.CharField(max_length=255)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chess_game.game')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='GuestGameRoom',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('white_player', models.CharField(blank=True, max_length=64)),
                ('black_player', models.CharField(blank=True, max_length=64)),
                ('game', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chess_game.game')),
            ],
        ),
        migrations.CreateModel(
            name='ComputerGameRoom',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('player', models.CharField(blank=True, max_length=64)),
                ('game', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='chess_game.game')),
            ],
        ),
    ]