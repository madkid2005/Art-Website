from rest_framework import serializers
from django.db.models import Avg  
from django.core.exceptions import ValidationError
from PIL import Image

from .models import Product, Category, Rating, Banner, Review
from apps.sellers.models import SellerProfile
from apps.buyers.models import BuyerProfile
from apps.orders.models import Order
# Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    icon = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_children(self, obj):
        children = obj.subcategories.all()  # Get child categories
        return CategorySerializer(children, many=True).data

    
    def get_icon(self, obj):
        request = self.context.get('request')
        if obj.icon and request:
            return request.build_absolute_uri(obj.icon.url)
        return None

# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    seller = serializers.PrimaryKeyRelatedField(queryset=SellerProfile.objects.all())
    seller_store_name = serializers.CharField(source='seller.store_name')

    # Category
    category = CategorySerializer(read_only=True) # Display category name

    # Category id
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source="category", write_only=True) # Allow setting category  

    # Image
    image = serializers.ImageField(required=True)  # Ensure it's a proper image field

    # Rating
    average_rating = serializers.SerializerMethodField()

    # Price (Toman)
    formatted_price = serializers.SerializerMethodField()
    formatted_sale_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        return obj.ratings.aggregate(Avg('score'))['score__avg']

    def get_formatted_price(self, obj):
        return f"{obj.price:,.0f} "
    
    def get_formatted_sale_price(self, obj):
        if obj.sale_price is None:
            return None 
        return f"{obj.sale_price:,.0f} "
    
    def validate_image(self, value):
        """Ensure that the uploaded image has dimensions 300x400"""
        try:
            img = Image.open(value)
            width, height = img.size
            if width != 300 or height != 400:
                raise ValidationError("Image must be 300x400 pixels.")
        except Exception as e:
            raise ValidationError(f"Invalid image: {e}")
        return value
    
    def validate_custom_features(self, value):
        """Ensure custom features are valid JSON"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Custom features must be a list of key-value pairs.")
        return value
    
# Rating Serializer
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

# Banner Serializer
class BannerSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source="category.id")
    category_name = serializers.CharField(source="category.name")

    class Meta:
        model = Banner
        fields = ['id', 'title', 'description', 'image', 'order', 'is_active', 'category_id', 'category_name']

# Comment serializer
class ReviewSerializer(serializers.ModelSerializer):
    buyer = serializers.PrimaryKeyRelatedField(queryset=BuyerProfile.objects.all())
    buyer_name = serializers.CharField(source="buyer.name", read_only=True)
    buyer_family_name = serializers.CharField(source="buyer.family_name", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'buyer','buyer_name', 'buyer_family_name', 'rating', 'comment', 'created_at']

    def create(self, validated_data):
        # Make sure the buyer can only review products they have purchased
        buyer = validated_data['buyer']
        product = validated_data['product']
        if not Order.objects.filter(buyer=buyer, product=product, status='Delivered').exists():
            raise serializers.ValidationError("You can only review products you've purchased.")
        return super().create(validated_data)