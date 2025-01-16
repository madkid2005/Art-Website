from django.contrib import admin
from .models import Category, Product
from django.utils.safestring import mark_safe
from mptt.admin import DraggableMPTTAdmin
from django.utils.html import format_html  


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent_category', 'icon_preview')
    list_filter = ('parent_category',)
    search_fields = ('name',)
    fields = ('name', 'parent_category', 'icon', 'icon_preview')
    readonly_fields = ('icon_preview',)

    def icon_preview(self, obj):
        if obj.icon:
            return format_html(f'<img src="{obj.icon.url}" style="width: 50px; height: 50px;" />')
        return "No Icon"

    icon_preview.short_description = "Icon Preview"

    def get_queryset(self, request):
        """Customize queryset to order categories hierarchically."""
        queryset = super().get_queryset(request)
        return queryset.order_by('parent_category__id', 'name')


class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'stock', 'category', 'image_preview', 'created_at',]
    list_filter = ['category']
    search_fields = ['name', 'description']
    ordering = ['-created_at', 'category']

    def image_preview(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="width: 50px; height: 50px;" />')
        return "No Product Image"
    


admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
