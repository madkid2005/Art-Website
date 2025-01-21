# Run this script in the Django shell
from .models import Category

parent_categories = [
    'سبک‌های کلاسیک و تاریخی',
    'سبک‌های مدرن و معاصر',
    'سبک‌های فرهنگی و منطقه‌ای',
    'سبک‌های انتزاعی و مفهومی',
    'سبک‌های تخصصی و تکنیکی',
    'سبک‌های خاص و جدید',
    'دسته‌بندی موضوعی',
]

for category_name in parent_categories:
    Category.objects.get_or_create(name=category_name)
