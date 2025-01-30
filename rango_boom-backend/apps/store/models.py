from django.db import models
from django.utils import timezone
from apps.sellers.models import SellerProfile
from apps.buyers.models import BuyerProfile
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.translation import gettext_lazy as _

class Category(MPTTModel):
    name = models.CharField(_("دسته بندی محصول"), max_length=255, unique=True)
    icon = models.ImageField(upload_to='category_icons/', blank=True, null=True)
    parent = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories'
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
    image = models.ImageField(_("عکس"), upload_to='product_images/')
    stock = models.PositiveIntegerField(_("تعداد موجود"),)
    dimensions = models.CharField(max_length=255, blank=True, null=True)  # New Field
    size = models.CharField(max_length=100, blank=True, null=True)  # New Field

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_on_sale = models.BooleanField(_("تخفیف خورده ؟"), default=False)
    sale_price = models.DecimalField(_("قیمت تخفیف خورده"), max_digits=10, decimal_places=2, null=True, blank=True)

    slug = models.SlugField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.category.name}) - {self.seller.store_name}"

   
class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey(BuyerProfile, related_name="ratings", on_delete=models.CASCADE)
    score = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'buyer')

    def __str__(self):
        return f"Rating: {self.score} for {self.product.name} by {self.buyer.user.mobile_number}"

    @property
    def average_rating(self):
        return self.product.ratings.aggregate(models.Avg('score'))['score__avg']


class Banner(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="banners/")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="banners")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    @classmethod
    def get_active_banners(cls):
        """Get active banners ordered by the 'order' field."""
        return cls.objects.filter(is_active=True).order_by('order')
    

# ---- Review Model ---- #
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
