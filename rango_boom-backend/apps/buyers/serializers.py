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
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = BuyerProfile
        fields = ['id', 'user', 'name', 'family_name', 'address', 'email', 'phone_number', 'created_at', 'age', 'zip_code', 'meli_code']
        read_only_fields = ['id', 'user', 'created_at', 'phone_number']  # Prevents unwanted updates to user-related fields

class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    buyer_name = serializers.CharField(source='buyer.user.name', read_only=True)
    buyer_phone = serializers.CharField(source='buyer.phone_number', read_only=True)  # Get phone_number from BuyerProfile

    class Meta:
        model = Order
        fields = [
            'id',
            'product_name',
            'buyer_name',
            'buyer_phone',
            'quantity',
            'total_price',
            'address',
            'status',
            'created_at',
        ]
        read_only_fields = ['total_price', 'created_at']

