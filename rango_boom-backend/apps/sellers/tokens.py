from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)
        token['is_seller'] = user.is_seller
        token['is_buyer'] = user.is_buyer
        return token
