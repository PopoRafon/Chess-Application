from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from api.models import Profile
from api.models import Room
import hashlib


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        profile = Profile.objects.create(user=instance)
        profile.save()

@receiver(post_save, sender=Room)
def create_hashed_url(sender, instance, created, **kwargs):
    if created:
        hash_input = f'{instance.id}'
        instance.hashed_url = hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
        instance.save()
