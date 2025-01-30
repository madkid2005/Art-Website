from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
import random

class CustomUserManager(BaseUserManager):
    def create_user(self, mobile_number, password=None, **extra_fields):
        if not mobile_number:
            raise ValueError(_("Mobile number is required"))
        user = self.model(mobile_number=mobile_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        # Check if is super user or not 
        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(mobile_number, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    mobile_number = models.CharField(max_length=15, unique=True)

    # Permission
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Seller OR Buyer
    is_seller = models.BooleanField(default=False)
    is_buyer = models.BooleanField(default=True)

    # date_joined = models.DateTimeField(auto_now_add=True)


    objects = CustomUserManager()

    USERNAME_FIELD = 'mobile_number'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.mobile_number

class OTP(models.Model):
    mobile_number = models.CharField(max_length=15)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp = str(random.randint(100000, 999999))
        self.save()

    def __str__(self):
        return f"OTP for {self.mobile_number}: {self.otp}"

class SellerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='seller_profile')
    store_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True, null=True)
    melicode = models.CharField(max_length=15)
    is_approved = models.BooleanField(default=False)
    bio = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Seller: {self.store_name} ({self.user.mobile_number})"
