# Generated by Django 4.2.1 on 2023-10-22 01:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_computergameroom_guestgameroom_usergameroom_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='computergameroom',
            old_name='room_id',
            new_name='room_url',
        ),
        migrations.RemoveField(
            model_name='computergameroom',
            name='black_timer',
        ),
        migrations.RemoveField(
            model_name='computergameroom',
            name='white_timer',
        ),
    ]
