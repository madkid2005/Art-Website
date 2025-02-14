from django.utils.deprecation import MiddlewareMixin

class IdentifyUserMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            request.is_seller = request.user.is_seller
            request.is_buyer = request.user.is_buyer
