from rest_framework import serializers
from .models import SellerProfile, CustomUser
from apps.store.models import Product
from apps.orders.models import Order

# USER serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'mobile_number', 'is_staff', 'is_seller', 'is_active']

# Seller Profile Serializer
class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ['id', 'store_name', 'bio', 'phone_number', 'address', 'melicode', 'is_approved']


# Seller Products
class SellerProductSerializer(serializers.ModelSerializer):
    seller = serializers.PrimaryKeyRelatedField(queryset=SellerProfile.objects.all())

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'category', 'stock', 'created_at', 'updated_at', 'image']

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