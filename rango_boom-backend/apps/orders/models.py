from django.db import models
from apps.buyers.models import BuyerProfile
from apps.store.models import Product



class Order(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
    buyer = models.ForeignKey(BuyerProfile, on_delete=models.CASCADE, related_name='orders')

    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Delivered', 'Delivered')],
        default='Pending'
    )

    def __str__(self):
        return f"Order for {self.product.name} by {self.buyer_name} mobile : {self.buyer_phone}"


    def get_buyer_name(self):
        return f"Order {self.id} by {self.buyer.name}"
