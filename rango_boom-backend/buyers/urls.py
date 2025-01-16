from django.urls import path
from .views import BuyerProfileView, OrderListView, OrderDetailView, CartView

urlpatterns = [
    path('profile/', BuyerProfileView.as_view(), name='buyer-profile'),
    path('orders/', OrderListView.as_view(), name='buyer-orders'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='buyer-order-detail'),
    path('cart/', CartView.as_view(), name='buyer-cart'),
]
