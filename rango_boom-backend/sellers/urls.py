from django.urls import path
from .views import SellerProfileView, SellerProductListView, SellerProductDetailView, SellerOrderListView

urlpatterns = [
    path('profile/', SellerProfileView.as_view(), name='seller-profile'),
    path('products/', SellerProductListView.as_view(), name='seller-products'),
    path('products/<int:pk>/', SellerProductDetailView.as_view(), name='seller-product-detail'),
    path('orders/', SellerOrderListView.as_view(), name='seller-orders'),
]
