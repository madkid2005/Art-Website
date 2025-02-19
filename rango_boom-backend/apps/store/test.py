from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path
from django.utils.html import format_html
from .models import Product  # Import your model

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'duplicate_link')  # Add a link column
    actions = ['duplicate_selected']

    def duplicate_link(self, obj):
        return format_html('<a href="{}">Duplicate</a>', f'../duplicate/{obj.pk}/')
    duplicate_link.short_description = "Duplicate"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('duplicate/<int:pk>/', self.duplicate_view, name='duplicate_product'),
        ]
        return custom_urls + urls

    def duplicate_view(self, request, pk):
        product = Product.objects.get(pk=pk)
        product.pk = None  # Reset primary key to create a new object
        product.save()
        self.message_user(request, "Product duplicated successfully.")
        return redirect("..")

admin.site.register(Product, ProductAdmin)