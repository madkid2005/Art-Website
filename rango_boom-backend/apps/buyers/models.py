from django.db import models
from apps.sellers.models import CustomUser

class BuyerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='buyer_profile')

    name = models.CharField(max_length=255)
    family_name = models.CharField(max_length=255)
    age = models.IntegerField(null=True, blank=True)

    phone_number = models.CharField(max_length=20, blank=True, null=True)  
    address = models.TextField(blank=True, null=True)
    zip_code = models.CharField(max_length=15)
    meli_code = models.CharField(max_length=15)

    email = models.EmailField(unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name