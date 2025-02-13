from django.db import models
from django.utils import timezone
from apps.sellers.models import SellerProfile
from apps.buyers.models import BuyerProfile
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.translation import gettext_lazy as _

class Category(MPTTModel):
    name = models.CharField(_("دسته بندی محصول"), max_length=255, unique=True)
    icon = models.ImageField(_("آیکون"), upload_to='category_icons/', blank=True, null=True)
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories', verbose_name=_("زیرشاخه ی (والد)")
    )
    slug = models.SlugField(unique=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name=_("دسته‌بندی"))
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='products', verbose_name=_("فروشنده"))

    name = models.CharField(_("اسم محصول"), max_length=255)
    description = models.TextField(_("درباره ی محصول"),)
    price = models.DecimalField(_("قیمت"), max_digits=10, decimal_places=2)
    image = models.ImageField(_("عکس"), upload_to='product_images/', null=True, blank=True)
    stock = models.PositiveIntegerField(_("تعداد موجود"),)
    dimensions = models.CharField(_(" ابعاد"), max_length=255, blank=True, null=True)  
    size = models.CharField(_(" اندازه "), max_length=100, blank=True, null=True) 

    created_at = models.DateTimeField(_(" تاریخ ایجاد محصول "), auto_now_add=True)
    updated_at = models.DateTimeField(_(" تاریخ ویرایش محصول "), auto_now=True)

    is_on_sale = models.BooleanField(_("تخفیف خورده ؟"), default=False)
    sale_price = models.DecimalField(_("قیمت تخفیف خورده"), max_digits=10, decimal_places=2, null=True, blank=True)

    slug = models.SlugField(unique=True)

    fast_send = models.BooleanField(_(" ارسال سریع ؟" ), default=False)

    # Add custom features as a JSONField
    custom_features = models.JSONField(_("ویژگی های سفارشی"), default=list, blank=True)

    def __str__(self):
        return f"{self.name} ({self.category.name}) - {self.seller.store_name}"

    # Price
    def formatted_price(self, obj):
        return f"{obj.price:,.0f} Toman"  # Format with commas and add "Toman"
    
    formatted_price.short_description = "Price (Toman)"  # Column name in the admin panel

    # Sale_price
    def formatted_sale_price(self, obj):
        return f"{obj.sale_price:,.0f} Toman"  # Format with commas and add "Toman"
    
    formatted_sale_price.short_description = "Price (Toman)"  # Column name in the admin panel

   
class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings', verbose_name=_("محصول"))
    buyer = models.ForeignKey(BuyerProfile, related_name="ratings", on_delete=models.CASCADE, verbose_name=_("خریدار"))
    score = models.PositiveIntegerField(_(" امتیاز " ), choices=[(i, str(i)) for i in range(1, 6)])
    review = models.TextField(_(" کامنت " ), null=True, blank=True)
    created_at = models.DateTimeField(_(" تاریخ ثبت " ), auto_now_add=True)

    class Meta:
        unique_together = ('product', 'buyer')

    def __str__(self):
        return f"Rating: {self.score} for {self.product.name} by {self.buyer.user.mobile_number}"

    @property
    def average_rating(self):
        return self.product.ratings.aggregate(models.Avg('score'))['score__avg']


class Banner(models.Model):
    title = models.CharField(_(" عنوان " ), max_length=255)
    description = models.TextField(_(" توضیحات " ), blank=True, null=True)
    image = models.ImageField(_(" عکس " ), upload_to="banners/")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="banners", verbose_name=_("دسته‌بندی"))
    order = models.PositiveIntegerField(_(" ترتیب به شماره " ), default=0)
    is_active = models.BooleanField(_(" فعال یا غیر فعال " ), default=True)

    def __str__(self):
        return self.title

    @classmethod
    def get_active_banners(cls):
        """Get active banners ordered by the 'order' field."""
        return cls.objects.filter(is_active=True).order_by('order')
    

# ---- Review Model ---- #
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews', verbose_name=_("محصول"))
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, verbose_name=_("خریدار"))
    rating = models.PositiveIntegerField(_(" امتیاز " ), choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')])
    comment = models.TextField(_(" کامنت " ))
    created_at = models.DateTimeField(_(" تاریخ ثبت نظر " ), auto_now_add=True)

    def __str__(self):
        return f"Review by {self.buyer.name} for {self.product.name} ({self.rating} stars)"