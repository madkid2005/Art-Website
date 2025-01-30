from rest_framework import serializers
from .models import Order, Cart, CartItem

# Cart
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', "buyer", 'items']

# Order
class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    buyer_name = serializers.CharField(source='buyer.user.name', read_only=True)

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

