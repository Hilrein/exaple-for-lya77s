from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from .models import Category, Product, Order, OrderItem
from .forms import OrderForm, PriceFilterForm
from .cart import Cart
import json

def index(request):
    """Home page view"""
    # Featured products for home page
    products = Product.objects.filter(available=True)[:6]
    return render(request, 'shop/index.html', {'products': products})

def product_list(request, category_slug=None):
    """Product list view with optional category filter"""
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter(available=True)
    
    # Category filter
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    
    # Price filter
    form = PriceFilterForm(request.GET)
    if form.is_valid():
        min_price = form.cleaned_data.get('min_price')
        max_price = form.cleaned_data.get('max_price')
        
        if min_price:
            products = products.filter(price__gte=min_price)
        
        if max_price:
            products = products.filter(price__lte=max_price)
    
    context = {
        'category': category,
        'categories': categories,
        'products': products,
        'form': form
    }
    
    return render(request, 'shop/products.html', context)

def product_detail(request, id, slug):
    """Single product detail view"""
    product = get_object_or_404(Product, id=id, slug=slug, available=True)
    return render(request, 'shop/product_detail.html', {'product': product})

def about(request):
    """About page view"""
    return render(request, 'shop/about.html')

def contacts(request):
    """Contacts page view"""
    return render(request, 'shop/contacts.html')

@require_POST
def cart_add(request, product_id):
    """Add a product to the cart"""
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    
    # If the request is AJAX
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        cart.add(product=product, quantity=1)
        return JsonResponse({'status': 'ok', 'cart_total': len(cart)})
    
    # Regular POST request
    cart.add(product=product, quantity=1)
    return redirect('cart_detail')

def cart_remove(request, product_id):
    """Remove a product from the cart"""
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return redirect('cart_detail')

def cart_detail(request):
    """Shopping cart detail view"""
    cart = Cart(request)
    form = OrderForm()
    return render(request, 'shop/cart.html', {'cart': cart, 'form': form})

@require_POST
def order_create(request):
    """Create an order from cart items"""
    cart = Cart(request)
    
    if len(cart) == 0:
        return redirect('product_list')
    
    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save()
            
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    price=item['price'],
                    quantity=item['quantity']
                )
            
            # Clear the cart
            cart.clear()
            
            return render(request, 'shop/order_created.html', {'order': order})
    
    return redirect('cart_detail')