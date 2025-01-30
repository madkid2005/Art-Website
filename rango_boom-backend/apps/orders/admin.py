from django.contrib import admin
from .models import Order, Cart, CartItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['product', 'buyer', 'quantity', 'total_price', 'status', 'created_at']

admin.site.register(Cart)
admin.site.register(CartItem)
