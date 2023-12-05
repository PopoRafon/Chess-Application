# Generated by Django 4.2.1 on 2023-12-05 14:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_move_timestamp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='guestgameroom',
            name='game_started',
        ),
        migrations.RemoveField(
            model_name='rankinggameroom',
            name='game_started',
        ),
        migrations.AddField(
            model_name='game',
            name='black_timer',
            field=models.DurationField(blank=True, default=datetime.timedelta(seconds=600)),
        ),
        migrations.AddField(
            model_name='game',
            name='started',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='game',
            name='white_timer',
            field=models.DurationField(blank=True, default=datetime.timedelta(seconds=600)),
        ),
    ]
