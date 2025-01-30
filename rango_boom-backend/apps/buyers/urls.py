from django.urls import path
from .views import GenerateBuyerOTP, BuyerLogin, BuyerProfileView, BuyerOrderListView, OrderDetailView

urlpatterns = [
    path('otp/', GenerateBuyerOTP.as_view(), name='generate_otp'),
    path('login/', BuyerLogin.as_view(), name='buyer_login'),

    path('profile/', BuyerProfileView.as_view(), name='buyer_profile'),
    
    path('orders/', BuyerOrderListView.as_view(), name='buyer_orders'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='buyer-order-detail'),
    # path('cart/', CartView.as_view(), name='buyer-cart'),
]
