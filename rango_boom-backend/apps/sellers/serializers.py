from rest_framework import serializers
from .models import SellerProfile, CustomUser
from apps.store.models import Product
from apps.orders.models import Order

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'mobile_number', 'is_staff', 'is_seller', 'is_active']

class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'store_name', 'bio']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'category', 'created_at', 'updated_at']

class SellerOrderSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.user.mobile_number', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'buyer_name', 'product_name', 'quantity', 'total_price', 'status', 'created_at']
