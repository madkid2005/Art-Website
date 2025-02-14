from rest_framework import serializers
from .models import SellerProfile, CustomUser
from apps.store.models import Product, Category
from apps.orders.models import Order

# USER serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'is_seller', 'mobile_number', 'is_staff', 'is_active', 'date_joined']

# Seller Profile Serializer
class SellerProfileSerializer(serializers.ModelSerializer):
    mobile_number = serializers.CharField(source='user.mobile_number', read_only=True)
    class Meta:
        model = SellerProfile
        fields = ['id', 'name', 'family_name', 'store_name', 'bio', 'address', 'melicode', 'is_approved', 'mobile_number', 'phone_number']


# Seller Orders
class SellerOrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.user.mobile_number', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'product', 'product_name', 'buyer', 'buyer_name', 'quantity', 
            'total_price', 'address', 'created_at', 'status'
        ]


# Admin Seller Approval Serializer
class AdminSellerApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'store_name', 'phone_number', 'is_approved']