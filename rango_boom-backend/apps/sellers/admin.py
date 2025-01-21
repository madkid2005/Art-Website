from django.contrib import admin
from .models import CustomUser, SellerProfile


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['mobile_number', 'is_seller', 'is_active', 'is_staff']

@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ['store_name', 'phone_number', 'is_approved', 'created_at']

