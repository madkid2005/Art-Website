from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Banner, Review
from .serializers import ProductSerializer, CategorySerializer, BannerSerializer, ReviewSerializer
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from apps.orders.models import Order

# Category view ( Load parents and after childs )
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(parent__isnull=True)  # Only parent categories
    serializer_class = CategorySerializer
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve category details and its products."""
        category = self.get_object()
        products = category.products.all()
        products_serializer = ProductSerializer(products, many=True, context={'request': request})
        category_serializer = self.get_serializer(category)

        return Response({
            "category": category_serializer.data,
            "products": products_serializer.data
        })
    
# load child categories 
class ChildCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(subcategories__isnull=True)  # Categories with no children
    serializer_class = CategorySerializer

# Products view 
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category__slug', 'price', 'is_on_sale']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'average_rating']

    def get_queryset(self):
        queryset = super().get_queryset()
        filter_by = self.request.query_params.get('filter_by')

        if filter_by == 'latest':
            queryset = queryset.order_by('-created_at')
        elif filter_by == 'on_sale':
            queryset = queryset.filter(is_on_sale=True)
        elif filter_by == 'best_ratings':
            queryset = queryset.annotate(avg_rating=models.Avg('ratings__score')).order_by('-avg_rating')

        return queryset

    def get_serializer_context(self):
        """Pass request context to the serializer."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Banner view
class BannerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint to retrieve banners.
    """
    queryset = Banner.get_active_banners()
    serializer_class = BannerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

# Comment view - load comments
class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        """Fetch all reviews for a product"""
        product = get_object_or_404(Product, id=product_id)
        reviews = product.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, product_id):
        """Allow a buyer to add a review for a product"""
        product = get_object_or_404(Product, id=product_id)
        buyer = request.user.buyer_profile

        # if not Order.objects.filter(buyer=buyer, product=product, status='Delivered').exists():
        #     return Response({"detail": "You can only review products you've purchased."}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'product': product.id,
            'buyer': buyer.id,
            'rating': request.data.get('rating'),
            'comment': request.data.get('comment')
        }
        serializer = ReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckPurchaseView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, product_id):
        buyer = request.user.buyer_profile
        product = get_object_or_404(Product, id=product_id)

        has_purchased = Order.objects.filter(buyer=buyer, product=product, status='Delivered').exists()

        return Response({"purchased": has_purchased})
