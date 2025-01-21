from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
import random

# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied

# Files
from .models import SellerProfile, OTP, CustomUser
from .serializers import UserSerializer
from apps.store.models import Product
from apps.orders.models import Order
from apps.store.serializers import ProductSerializer
from apps.orders.serializers import OrderSerializer



# Generate OTP code <for registering sellers>
class GenerateSellerOTP(APIView):
    def post(self, request):
        mobile_number = request.data.get("mobile_number")
        if not mobile_number:
            return Response({"error": "Mobile number is required"}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))
        OTP.objects.update_or_create(
            mobile_number=mobile_number,
            defaults={"otp": otp}
        )
        # Integrate an SMS gateway here
        print(f"OTP for {mobile_number}: {otp}")  # For testing
        return Response({"message": "OTP sent successfully"})

# Verify Seller Mobile-OTP number
class SellerLogin(APIView):
    def post(self, request):
        mobile_number = request.data.get("mobile_number")
        otp = request.data.get("otp")

        if not mobile_number or not otp:
            return Response({"error": "Mobile number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        otp_record = get_object_or_404(OTP, mobile_number=mobile_number)
        if otp_record.otp != otp:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = CustomUser.objects.get_or_create(
            mobile_number=mobile_number,
            defaults={"is_seller": True}
        )
        if created:
            user.set_password(None)
            user.save()
            SellerProfile.objects.create(user=user, phone_number=mobile_number)

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        })

''' 
Seller Profile :
add - edit - remove Products after getting access 
'''

# seller add products list
class ProductListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        seller_profile = self.request.user.seller_profile
        if not seller_profile.is_approved:
            raise PermissionDenied("Your account is not approved yet.")
        return Product.objects.filter(seller=seller_profile)

    def perform_create(self, serializer):
        seller_profile = self.request.user.seller_profile
        if not seller_profile.is_approved:
            raise PermissionDenied("Your account is not approved yet.")
        serializer.save(seller=seller_profile)

# seller Products detail < edit : update or delete >
class ProductDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user.seller_profile)
    
# sellers order list
class SellerOrderListView(APIView):
    """
    Lists all orders for products owned by the logged-in seller.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller_profile = request.user.seller_profile
        if not seller_profile.is_approved:
            raise PermissionDenied("Your account is not approved yet.")
        
        orders = Order.objects.filter(product__seller=seller_profile)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

# sellers sale summary
class SellerSalesSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        seller_profile = request.user.seller_profile
        sales_summary = Product.objects.filter(seller=seller_profile).aggregate(
            total_sales=Sum('orders__quantity'),
            total_revenue=Sum('orders__total_price')
        )
        return Response(sales_summary)