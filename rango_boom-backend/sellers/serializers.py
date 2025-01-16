from rest_framework import serializers
from .models import SellerProfile
from store.models import Product
from buyers.models import Order

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
