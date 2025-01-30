from django.shortcuts import get_object_or_404
import random

# DRF
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework_simplejwt.tokens import RefreshToken

# Files
from .models import BuyerProfile, CustomUser
from .serializers import BuyerProfileSerializer, CustomUserSerializer, OrderSerializer

from apps.store.models import Product
from apps.sellers.models import OTP
from apps.orders.models import Order

# Generate OTP
class GenerateBuyerOTP(APIView):
    def post(self, request):
        mobile_number = request.data.get("mobile_number")
        if not mobile_number:
            return Response({"error": "Mobile number is required"}, status=HTTP_400_BAD_REQUEST)

        otp = str(random.randint(100000, 999999))
        OTP.objects.update_or_create(
            mobile_number=mobile_number,
            defaults={"otp": otp}
        )
        print(f"OTP for {mobile_number}: {otp}")  # For testing purposes
        return Response({"message": "OTP sent successfully"})

# Verify OTP and Login/Register
class BuyerLogin(APIView):
    def post(self, request):
        mobile_number = request.data.get("mobile_number")
        otp = request.data.get("otp")

        if not mobile_number or not otp:
            return Response({"error": "Mobile number and OTP are required"}, status=HTTP_400_BAD_REQUEST)

        otp_record = get_object_or_404(OTP, mobile_number=mobile_number)
        if otp_record.otp != otp:
            return Response({"error": "Invalid OTP"}, status=HTTP_400_BAD_REQUEST)

        user, created = CustomUser.objects.get_or_create(
            mobile_number=mobile_number, defaults={"is_buyer": True}
        )
        if created:
            user.set_password(None)
            user.save()

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": CustomUserSerializer(user).data
        })

# Buyer Dashboard: View and Edit Profile
class BuyerProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BuyerProfileSerializer

    def get_object(self):
        return self.request.user.buyer_profile

# View Orders
class BuyerOrderListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user.buyer_profile)

# Orders detail
class OrderDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user.buyer_profile)

