from django.shortcuts import get_object_or_404
from django.db.models import Sum, Count
import random

# DRF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied

# Files
from .models import SellerProfile, OTP, CustomUser
from .serializers import UserSerializer, SellerOrderSerializer, SellerProfileSerializer, AdminSellerApprovalSerializer
from apps.store.models import Product, Category
from apps.orders.models import Order
from apps.store.serializers import ProductSerializer



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


# 🚀 Seller can update their profile
class SellerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Retrieve seller profile."""
        seller_profile = get_object_or_404(SellerProfile, user=request.user)
        serializer = SellerProfileSerializer(seller_profile)
        return Response(serializer.data)

    def put(self, request):
        """Allow first-time sellers to submit profile details."""
        seller_profile, created = SellerProfile.objects.get_or_create(user=request.user)

        # Prevent approved sellers from modifying their profile
        if seller_profile.is_approved and not created:
            return Response({"error": "You cannot modify your profile after approval."}, 
                            status=status.HTTP_403_FORBIDDEN)

        serializer = SellerProfileSerializer(seller_profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save(is_approved=False)  # Ensure approval stays pending
            return Response({
                "message": "Profile updated successfully. Your account is being verified, please wait.",
                "profile": serializer.data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 🚀 Admin can approve or reject sellers
class AdminSellerApprovalView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """List all sellers with approval status."""
        sellers = SellerProfile.objects.all()
        serializer = AdminSellerApprovalSerializer(sellers, many=True)
        return Response(serializer.data)

    def put(self, request, seller_id):
        """Approve or reject a seller."""
        seller_profile = get_object_or_404(SellerProfile, id=seller_id)
        is_approved = request.data.get('is_approved')

        if is_approved is not None:
            seller_profile.is_approved = is_approved
            seller_profile.save()
            return Response({"message": "Seller approval status updated."})
        
        return Response({"error": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
    
# seller add products list
class ProductListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        seller_profile = self.request.user.seller_profile

         # check approved 
        if not seller_profile.is_approved:
            raise PermissionDenied("Your account is not approved yet.")
        
        return Product.objects.filter(seller=seller_profile)

    def perform_create(self, serializer):
        seller_profile = self.request.user.seller_profile

        # check approved 
        if not seller_profile.is_approved:
            raise PermissionDenied("Your account is not approved yet.")
        
        # Ensure category is provided
        category = self.request.data.get("category")
        if not category:
            return Response({"error": "Category is required"}, status=status.HTTP_400_BAD_REQUEST)

        # serializer.save(seller=seller_profile)

        # Save product instance with the seller
        product = serializer.save(seller=seller_profile)

        # If you want to set the category explicitly, ensure it's done properly here
        category_id = self.request.data.get("category_id")
        if category_id:
            product.category = Category.objects.get(id=category_id)
            product.save()

    def get_serializer_context(self):
        # Ensure request context is passed to the serializer
        context = super().get_serializer_context()
        context['request'] = self.request  # Add the request object to context
        return context
    
# seller Products detail < edit : update or delete >
class ProductDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user.seller_profile)

# Seller Order View
class SellerOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all orders for the seller's products."""
        orders = Order.objects.filter(product__seller=request.user.seller_profile)
        serializer = SellerOrderSerializer(orders, many=True)
        return Response(serializer.data)

    def put(self, request, order_id):
        """Update the status of an order."""
        order = Order.objects.filter(product__seller=request.user.seller_profile, id=order_id).first()
        if not order:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        status_update = request.data.get('status')
        if status_update not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status update."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_update
        order.save()
        return Response({"message": f"Order status updated to {status_update}."})
    
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