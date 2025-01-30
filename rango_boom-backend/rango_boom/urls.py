from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('grappelli/', include('grappelli.urls')),  # Grappelli admin URLs
    path('admin/', admin.site.urls),
    path('api/store/', include('apps.store.urls')),
    path('api/sellers/', include('apps.sellers.urls')),
    path('api/buyers/', include('apps.buyers.urls')),

]
# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)