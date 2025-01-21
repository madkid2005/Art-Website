from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

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
