from .models import Category
from .cart import Cart

def categories(request):
    """
    Context processor to make all categories available in templates
    """
    return {
        'categories': Category.objects.all()
    }

def cart(request):
    """
    Context processor to make cart available in templates
    """
    return {'cart': Cart(request)}