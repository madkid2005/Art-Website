from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from django.shortcuts import get_object_or_404

# Files
from .models import BuyerProfile, Order, OTP, CustomUser
from store.models import Product
from .serializers import BuyerProfileSerializer, OrderSerializer, CartProductSerializer


# Buyer profile
class BuyerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = BuyerProfile.objects.get(user=request.user)
        serializer = BuyerProfileSerializer(profile)
        return Response(serializer.data, status=HTTP_200_OK)

# Orders list
class OrderListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user.buyer_profile)

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user.buyer_profile)

# Orders detail
class OrderDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user.buyer_profile)

# cart
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Example logic for fetching cart items (depends on your cart implementation)
        cart_products = Product.objects.filter(id__in=request.user.buyer_profile.cart_items)
        serializer = CartProductSerializer(cart_products, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

# Send otp
class SendOTPView(APIView):
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        if not mobile_number:
            return Response({"error": "Mobile number is required."}, status=HTTP_400_BAD_REQUEST)
        
        otp, _ = OTP.objects.get_or_create(mobile_number=mobile_number)
        otp.generate_otp()
        return Response({"message": "OTP sent successfully.", "otp": otp.otp}, status=HTTP_200_OK)

# Verify otp
class VerifyOTPView(APIView):
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        otp_code = request.data.get('otp')

        otp = get_object_or_404(OTP, mobile_number=mobile_number, otp=otp_code)
        user, created = CustomUser.objects.get_or_create(mobile_number=mobile_number)

        return Response({"message": "Login successful.", "user_id": user.id}, status=HTTP_200_OK)
