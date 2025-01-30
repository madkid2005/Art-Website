from rest_framework import viewsets, filters
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
class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        product = Product.objects.get(id=product_id)

        # Check if the user has bought the product
        if not Order.objects.filter(product=product, buyer=self.request.user).exists():
            raise PermissionDenied("You can only review products you have purchased.")
        
        # Save the review with the associated product and buyer
        serializer.save(product=product, buyer=self.request.user)


