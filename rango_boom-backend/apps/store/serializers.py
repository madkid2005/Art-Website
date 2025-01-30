from rest_framework import serializers
from django.db.models import Avg  
from .models import Product, Category, Rating, Banner, Review
from apps.sellers.models import SellerProfile

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

    # Category
    category = CategorySerializer(read_only=True) # Display category name

    # Category id
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source="category", write_only=True) # Allow setting category  

    # Image
    image = serializers.SerializerMethodField()

    # Rating
    average_rating = serializers.SerializerMethodField()

    # Price (Toman)
    formatted_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        request = self.context.get('request', None)
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        return obj.ratings.aggregate(Avg('score'))['score__avg']

    def get_formatted_price(self, obj):
        return f"{obj.price:,.0f} Toman"
    
    def get_formatted_sale_price(self, obj):
        return f"{obj.sale_price:,.0f} Toman"
    
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
    class Meta:
        model = Review
        fields = ['id', 'product', 'buyer', 'rating', 'comment', 'created_at']
        read_only_fields = ['buyer']