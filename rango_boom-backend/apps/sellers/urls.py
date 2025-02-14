from django.urls import path
from .views import (
    GenerateSellerOTP, SellerLogin, ProductListCreateView,ProductDetailView, 
    SellerOrderView, SellerSalesSummaryView, SellerProfileView, AdminSellerApprovalView, SellerListView, CurrentUserView
)

urlpatterns = [

    # Seller Registering with Mobile and OTP
    path('generate-otp/', GenerateSellerOTP.as_view(), name='generate_seller_otp'),
    path('login/', SellerLogin.as_view(), name='seller_login'),

    # Seller Profile
    path('profile/', SellerProfileView.as_view(), name='seller-profile'),

    # Products of sellers
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Sellers infos
    path('orders/', SellerOrderView.as_view(), name='seller-orders'),
    path('orders/<int:order_id>/', SellerOrderView.as_view(), name='seller-order-detail'),

    path('sales-summary/', SellerSalesSummaryView.as_view(), name='sales-summary'),
    
    # Admin: Approve/Reject Sellers
    path('admin/sellers/', AdminSellerApprovalView.as_view(), name='admin-sellers'),
    path('admin/sellers/<int:seller_id>/approve/', AdminSellerApprovalView.as_view(), name='admin-seller-approve'),

    # List of all sellers 
    path('list/', SellerListView.as_view(), name='seller-list'),

    # get current user info 
    path('api/users/me/', CurrentUserView.as_view(), name='current-user'),

]
