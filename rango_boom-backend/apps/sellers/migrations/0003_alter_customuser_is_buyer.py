# Generated by Django 5.1.5 on 2025-02-13 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sellers', '0002_sellerprofile_family_name_sellerprofile_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='is_buyer',
            field=models.BooleanField(default=False),
        ),
    ]
