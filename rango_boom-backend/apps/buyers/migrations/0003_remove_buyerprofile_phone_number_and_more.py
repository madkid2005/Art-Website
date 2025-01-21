# Generated by Django 5.1.5 on 2025-01-19 15:07

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('buyers', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='buyerprofile',
            name='phone_number',
        ),
        migrations.AddField(
            model_name='buyerprofile',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='buyerprofile',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='buyerprofile',
            name='name',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
    ]
