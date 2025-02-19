from django import forms
from .models import Product



# Products
class ProductForm(forms.ModelForm):
    feature_1_key = forms.CharField(required=True, label=" 1 ویژگی ")
    feature_1_value = forms.CharField(required=True, label=" مقدار ویژگی ۱ ")
    
    feature_2_key = forms.CharField(required=True, label=" 2 ویژگی ")
    feature_2_value = forms.CharField(required=True, label=" مقدار ویژگی 2 ")
    
    feature_3_key = forms.CharField(required=True, label=" 3 ویژگی ")
    feature_3_value = forms.CharField(required=True, label=" مقدار ویژگی 3 ")

    class Meta:
        model = Product
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        custom_features = {}

        for i in range(1, 4):  # If you need 6, change range(1, 4) to range(1, 7)
            key = cleaned_data.get(f'feature_{i}_key')
            value = cleaned_data.get(f'feature_{i}_value')

            if key and value:  # Only add non-empty fields
                custom_features[key] = value

        cleaned_data['custom_features'] = custom_features
        return cleaned_data

    def save(self, commit=True):
        instance = super().save(commit=False)
        instance.custom_features = self.cleaned_data['custom_features']
        if commit:
            instance.save()
        return instance