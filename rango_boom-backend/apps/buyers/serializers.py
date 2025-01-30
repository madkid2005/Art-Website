from rest_framework import serializers

from .models import BuyerProfile
from .models import CustomUser, BuyerProfile

from apps.sellers.models import OTP
from apps.orders.models import Order



class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['mobile_number', 'otp']


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'mobile_number', 'is_buyer']


class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ['id', 'name', 'address', 'email', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'product_name', 'status', 'created_at']

