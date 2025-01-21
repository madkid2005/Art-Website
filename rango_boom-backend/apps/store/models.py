from django.db import models
from django.utils import timezone
from apps.sellers.models import SellerProfile
# from apps.buyers.models import BuyerProfile

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    icon = models.ImageField(upload_to='category_icons/', blank=True, null=True)
    parent_category = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories'
    )
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(models.Model):
    # Category
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    # Seller
    seller = models.ForeignKey(SellerProfile, on_delete=models.CASCADE, related_name='products')

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='product_images/')
    stock = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_on_sale = models.BooleanField(default=False)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    slug = models.SlugField(unique=True)

    def __str__(self):
        return f"{self.name} ({self.category.name}) {self.seller.store_name}"

class Rating(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='ratings')
    buyer = models.ForeignKey("buyers.BuyerProfile", related_name="ratings", on_delete=models.CASCADE)
    score = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    review = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'buyer')

    def __str__(self):
        return f"Rating: {self.score} for {self.product.name} by {self.buyer.user.mobile_number}"
