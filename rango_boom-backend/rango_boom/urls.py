from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView


urlpatterns = [
    path('grappelli/', include('grappelli.urls')),  # Grappelli admin URLs
    path('admin/', admin.site.urls),
    path('api/store/', include('apps.store.urls')),
    path('api/sellers/', include('apps.sellers.urls')),
    path('api/buyers/', include('apps.buyers.urls')),
    path('api/orders/', include('apps.orders.urls')),

    # Token 
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),


]
# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)