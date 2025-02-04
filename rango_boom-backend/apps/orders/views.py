# buyers/views.py
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from apps.store.models import Product
from .models import Order, Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer


'''
cart views for cart iteam add - edit - remove 
'''
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve the buyer's cart."""
        cart, created = Cart.objects.get_or_create(buyer=request.user.buyer_profile)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Add a product to the cart."""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        cart, created = Cart.objects.get_or_create(buyer=request.user.buyer_profile)
        product = get_object_or_404(Product, id=product_id)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        cart_item.save()

        return Response({"message": "Product added to cart."}, status=status.HTTP_201_CREATED)

    def put(self, request):
        """Update the quantity of a cart item."""
        cart_item_id = request.data.get('cart_item_id')
        quantity = request.data.get('quantity')

        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__buyer=request.user.buyer_profile)
        cart_item.quantity = quantity
        cart_item.save()

        return Response({"message": "Cart item updated."}, status=status.HTTP_200_OK)

    def delete(self, request):
        """Remove an item from the cart."""
        cart_item_id = request.data.get('cart_item_id')

        cart_item = get_object_or_404(CartItem, id=cart_item_id, cart__buyer=request.user.buyer_profile)
        cart_item.delete()

        return Response({"message": "Cart item removed."}, status=status.HTTP_204_NO_CONTENT)


'''
Order views 
'''
class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Place an order from the cart."""
        cart = request.user.buyer_profile.cart
        if not cart.items.exists():
            return Response({"error": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        # order = Order.objects.create(
        #     buyer=request.user.buyer_profile,
        #     total_price=sum(item.product.price * item.quantity for item in cart.items.all())
        # )
        # for item in cart.items.all():
        #     order.items.add(item.product, through_defaults={"quantity": item.quantity})
        # cart.items.clear()
        orders = []
        for item in cart.items.all():
            order = Order.objects.create(
                product=item.product,
                buyer=request.user.buyer_profile,
                quantity=item.quantity,
                total_price=item.quantity * item.product.price,
                address=request.data.get('address'),
            )
            orders.append(order)
        cart.items.clear()

        serializer = OrderSerializer(orders, many=True)
        return Response({"message": "Order(s) placed successfully.", "orders": serializer.data}, status=status.HTTP_201_CREATED)


class OrderStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve all orders for the authenticated buyer."""
        orders = Order.objects.filter(buyer=request.user.buyer_profile).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def put(self, request, order_id):
        """Update the status of an order (for sellers)."""
        order = get_object_or_404(Order, id=order_id)
        if order.product.seller.user != request.user:
            return Response({"error": "Unauthorized action."}, status=status.HTTP_403_FORBIDDEN)

        status_update = request.data.get('status')
        if status_update not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status update."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_update
        order.save()
        return Response({"message": f"Order status updated to {status_update}."}, status=status.HTTP_200_OK)