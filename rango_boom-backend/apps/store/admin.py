from django.contrib import admin
from .models import Category, Product, Review, Banner
from django.utils.safestring import mark_safe
from django.utils.html import format_html  
from mptt.admin import MPTTModelAdmin
from django.utils.translation import gettext_lazy as _
from apps.store.forms import ProductForm
from django.shortcuts import redirect
from django.urls import path


# Child Category Adding 
class SubCategoryInline(admin.TabularInline):
    model = Category
    fields = ('name', 'slug', 'icon')
    extra = 1
    prepopulated_fields = {'slug': ('name',)}

# Category
@admin.register(Category)
class CategoryAdmin(MPTTModelAdmin):
    list_display = ('name', 'parent', 'icon_preview', 'slug')
    search_fields = ('name',)
    list_filter = ('parent',)
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SubCategoryInline]
    autocomplete_fields = ['parent']
    mptt_level_indent = 20  # Optional: Controls indentation for tree structure
    verbose_name = _("دسته بندی ها")  # Custom translation

    def icon_preview(self, obj):
        if obj.icon:
            return format_html(f'<img src="{obj.icon.url}" style="width: 50px; height: 50px;" />')
        return "No Icon"

    icon_preview.short_description = "Icon Preview"



@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    list_display = ('name', 'category', 'seller', 'formatted_price', 'stock', 'is_on_sale', 'fast_send', 'image_preview', 'duplicate_link')
    list_filter = ('category', 'seller', 'is_on_sale')
    search_fields = ('name', 'description')
    # prepopulated_fields = {'slug': ('name',)}
    verbose_name = _("مدیریت محصولات")  # Custom translation
    actions = ['duplicate_selected']

    def image_preview(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="width: 50px; height: 50px;" />')
        return "No Product Image"
    
    # Price
    def formatted_price(self, obj):
        return f"{obj.price:,.0f} Toman"  # Format with commas and add "Toman"
    
    formatted_price.short_description = "Price (Toman)"  # Column name in the admin panel

    # Sale_price
    def formatted_sale_price(self, obj):
        return f"{obj.sale_price:,.0f} Toman"  # Format with commas and add "Toman"
    
    formatted_sale_price.short_description = "Price (Toman)"  # Column name in the admin panel

    # Place Holder Of price
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        field = super().formfield_for_dbfield(db_field, request, **kwargs)
        if db_field.name == "price" and "sale_price":
            field.widget.attrs["placeholder"] = "قیمت به تومان"
        return field

    # Duplicate a Product 
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

    def duplicate_selected(modeladmin, request, queryset):
        for obj in queryset:
            obj.pk = None  # Reset primary key
            obj.save()
        modeladmin.message_user(request, "Selected products duplicated successfully.")

    duplicate_selected.short_description = "Duplicate selected products"

# Banner
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    ordering = ['order']  # Orders by price in ascending order
    list_display = ('title', 'image_preview', 'category', 'order', 'is_active',)
    list_filter = ('order', 'is_active',)
    search_fields = ('title', 'order',)
    verbose_name = _("عکس ها-بنرها")  # Custom translation

    def image_preview(self, obj):
        if obj.image:
            return format_html(f'<img src="{obj.image.url}" style="width: 50px; height: 50px;" />')
        return "No Product Image"
    

# Rating
admin.site.register(Review)
