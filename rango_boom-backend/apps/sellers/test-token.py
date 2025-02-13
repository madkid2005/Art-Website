from rest_framework_simplejwt.tokens import AccessToken

token_string = "your_jwt_access_token_here"

try:
    token = AccessToken(token_string)
    print("Token is valid for user:", token["user_id"])
except Exception as e:
    print("Token is invalid:", str(e))
