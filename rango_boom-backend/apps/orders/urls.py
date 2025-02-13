from django.urls import path
from .views import CartView, PlaceOrderView, OrderStatusView, BuyerPurchasesView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('place-order/', PlaceOrderView.as_view(), name='place-order'),
    path('orders/', OrderStatusView.as_view(), name='order-status'),
    path('orders/<int:order_id>/', OrderStatusView.as_view(), name='update-order-status'),
    path('purchases/', BuyerPurchasesView.as_view(), name='buyer-purchases'),

]
