# Generated by Django 5.1.5 on 2025-02-13 20:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('buyers', '0004_buyerprofile_age_buyerprofile_zip_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='buyerprofile',
            name='meli_code',
            field=models.CharField(default=0, max_length=15),
            preserve_default=False,
        ),
    ]
