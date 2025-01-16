from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# Files
from .models import SellerProfile, OTP, CustomUser
from store.models import Product
from buyers.models import Order
from .serializers import SellerProfileSerializer, ProductSerializer, SellerOrderSerializer

class SellerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = SellerProfile.objects.get(user=request.user)
        serializer = SellerProfileSerializer(profile)
        return Response(serializer.data, status=HTTP_200_OK)


class SellerProductListView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user.seller_profile)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user.seller_profile)


class SellerProductDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user.seller_profile)


class SellerOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(product__seller=self.request.user.seller_profile)
        serializer = SellerOrderSerializer(orders, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

class SendOTPView(APIView):
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        if not mobile_number:
            return Response({"error": "Mobile number is required."}, status=HTTP_400_BAD_REQUEST)
        
        otp, _ = OTP.objects.get_or_create(mobile_number=mobile_number)
        otp.generate_otp()
        return Response({"message": "OTP sent successfully.", "otp": otp.otp}, status=HTTP_200_OK)


class VerifyOTPView(APIView):
    def post(self, request):
        mobile_number = request.data.get('mobile_number')
        otp_code = request.data.get('otp')

        otp = get_object_or_404(OTP, mobile_number=mobile_number, otp=otp_code)
        user, created = CustomUser.objects.get_or_create(mobile_number=mobile_number)

        return Response({"message": "Login successful.", "user_id": user.id}, status=HTTP_200_OK)
