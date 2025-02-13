from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, BannerViewSet, ReviewView, CheckPurchaseView
from .upload_image import upload_product_image

router = DefaultRouter()
# products urls
router.register(r'products', ProductViewSet, basename='products')
# categories urls
router.register(r'categories', CategoryViewSet, basename='categories')
# banners urls
router.register(r'banners', BannerViewSet, basename='banners')
# products urls
# router.register(r'products/(?P<product_id>\d+)/reviews', ReviewView, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('upload-product-image/', upload_product_image, name='upload-product-image'),
    path('products/<int:product_id>/reviews/', ReviewView.as_view(), name='product-reviews'),
    path('check-purchase/<int:product_id>/', CheckPurchaseView.as_view(), name='check-purchase'),




]




# Store app API Endpoints document

'''
# Products
GET /products/?filter_by=latest --->>>   akharin mahsolat
GET /products/?category=<category_id> --->>>   mahsolat bar asas dastebandi
GET /products/?categories=1,2 --->>>   if has 2 categories


GET /products/?filter_by=on_sale --->>>   takhfifkhorde 
GET /products/?filter_by=best_ratings --->>>   bishtarin emtiaz gerefteshode
GET /api/store/products/{product_id}/ --->>>   safe joziyate mahsol

# Categories
GET /categories/ --->>>   Fetch parent categories with nested children for the navbar.
GET /categories/children/ --->>>   Fetch all child categories for the "Shop by Category" section.
GET /products/?category=<category_id> --->>>    Fetch products for a specific category.


# Banner
GET /banners/ --->>>   List all active banners ordered by order.
GET /banners/{id}/ --->>>   Retrieve details of a specific banner.
/banners/ --->>>   Fetch active banners.
/banners/?category=<category_id> --->>>   Fetch banners for a specific category.


'''