from django.contrib import admin
from .models import Category, Product, Rating, Banner
from django.utils.safestring import mark_safe
from django.utils.html import format_html  
from mptt.admin import MPTTModelAdmin
from django.utils.translation import gettext_lazy as _
from django import forms

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

# Products
class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'image', 'category', 'custom_features', 'seller', 'dimensions', 'size', 'slug', 'stock']

    custom_features = forms.JSONField(
        required=False,
        widget=forms.Textarea(attrs={'rows': 4, 'placeholder': 'Enter key-value pairs as a JSON, max 6 features'}),
    )
    # Make the 'slug' field read-only in the form since it will be auto-generated in the admin
    slug = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={'readonly': 'readonly'})
    )

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    list_display = ('name', 'category', 'seller', 'formatted_price', 'stock', 'is_on_sale', 'image_preview',)
    list_filter = ('category', 'seller', 'is_on_sale')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    verbose_name = _("مدیریت محصولات")  # Custom translation

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
admin.site.register(Rating)
