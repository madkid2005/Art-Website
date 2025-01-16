from rest_framework import serializers
from .models import BuyerProfile, Order
from store.models import Product

class BuyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerProfile
        fields = ['id', 'address', 'phone_number']


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    seller_name = serializers.CharField(source='product.seller.store_name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'product_name', 'seller_name', 'quantity', 'total_price', 'status', 'created_at']


class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'image']
