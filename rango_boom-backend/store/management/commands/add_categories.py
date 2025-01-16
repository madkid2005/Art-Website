from django.core.management.base import BaseCommand
from .models import Category

class Command(BaseCommand):
    help = "Add initial categories to the database"

    def handle(self, *args, **kwargs):
        categories = [
            {"name": "رئالیسم (واقع‌گرایی)", "parent_category": "classic_historic"},
            {"name": "کلاسیک (کلاسیسیسم)", "parent_category": "classic_historic"},
            {"name": "رمانتیسیسم", "parent_category": "classic_historic"},
            {"name": "باروک", "parent_category": "classic_historic"},
            {"name": "رنسانس", "parent_category": "classic_historic"},
            {"name": "امپرسیونیسم (برداشت‌گرایی)", "parent_category": "classic_historic"},
            {"name": "پست امپرسیونیسم", "parent_category": "classic_historic"},
            {"name": "ناتورالیسم (طبیعت‌گرایی)", "parent_category": "classic_historic"},
            # Add other categories here...
        ]

        for cat in categories:
            Category.objects.get_or_create(name=cat["name"], parent_category=cat["parent_category"])
        
        self.stdout.write(self.style.SUCCESS("Categories added successfully."))
