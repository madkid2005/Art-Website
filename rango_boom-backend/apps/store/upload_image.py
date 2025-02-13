from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework.decorators import api_view
import base64
import uuid
from .models import Product

@api_view(['POST'])
def upload_product_image(request):
    if 'image' in request.data:
        # Get the base64 encoded image string from the request
        image_data = request.data['image']
        
        # Validate and ensure proper image format
        try:
            format, imgstr = image_data.split(';base64,')
            ext = format.split('/')[1]  # Extract file extension (e.g., 'jpeg', 'png')
            # Check if the extracted extension is valid
            allowed_extensions = ['bmp', 'dib', 'gif', 'jfif', 'jpe', 'jpg', 'jpeg', 'png', 'webp']
            if ext not in allowed_extensions:
                return Response({"error": "File extension not allowed. Allowed extensions are: " + ', '.join(allowed_extensions)}, status=400)
            
            image_content = ContentFile(base64.b64decode(imgstr), name=str(uuid.uuid4()) + '.' + ext)

            # Save image in Product model
            product = Product.objects.create(
                seller=request.user.sellerprofile,  # Example for seller
                name="Sample Product",  # Add more fields here
                description="Sample description",
                image=image_content  # Save image here
            )

            return Response({"message": "Product image uploaded successfully", "product": product.id})
        except Exception as e:
            return Response({"error": f"Error processing image: {str(e)}"}, status=400)

    return Response({"error": "No image found"}, status=400)
