from django.urls import path
from .views import GenerateSellerOTP, SellerLogin, ProductListCreateView, ProductDetailView, SellerOrderListView, SellerSalesSummaryView

urlpatterns = [

    # Seller Registering with Mobile and OTP
    path('generate-otp/', GenerateSellerOTP.as_view(), name='generate_seller_otp'),
    path('login/', SellerLogin.as_view(), name='seller_login'),

    # Products of sellers
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Sellers infos
    path('orders/', SellerOrderListView.as_view(), name='seller-orders'),
    path('sales-summary/', SellerSalesSummaryView.as_view(), name='sales-summary'),
    
]
