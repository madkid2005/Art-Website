from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.sellers.models import CustomUser
from .models import BuyerProfile


# Signal to create BuyerProfile when a new buyer registers
@receiver(post_save, sender=CustomUser)
def create_buyer_profile(sender, instance, created, **kwargs):
    if created and instance.is_buyer:
        BuyerProfile.objects.create(user=instance, name=instance.mobile_number)