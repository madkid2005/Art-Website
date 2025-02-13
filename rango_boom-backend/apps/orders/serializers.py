from rest_framework import serializers
from .models import Order, Cart, CartItem

# Cart
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=3, read_only=True)
    product_image = serializers.ImageField(source="product.image", read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'product_image', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields = ['id', "buyer", 'items']

# Order
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

