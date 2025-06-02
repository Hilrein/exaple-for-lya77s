function updateCartItemQuantity(productId, quantity) {
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
    fetch(`/cart/update/${productId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            document.querySelector('.cart-count').textContent = data.cart_total;
            document.querySelector(`#item-${productId}-total`).textContent = data.item_total + ' ₸';
            document.querySelector('#cart-total').textContent = data.cart_total_price + ' ₸';
            
            showNotification('Корзина обновлена!', 'success');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Ошибка при обновлении корзины.', 'error');
    });
}

/**
 * Clear the entire cart
 */
function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        fetch('/cart/clear/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Ошибка при очистке корзины.', 'error');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        control.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const productId = input.dataset.productId;
            let quantity = parseInt(input.value);
            
            if (this.classList.contains('quantity-decrement')) {
                quantity = Math.max(1, quantity - 1);
            } else if (this.classList.contains('quantity-increment')) {
                quantity = Math.min(99, quantity + 1);
            }
            
            input.value = quantity;
            updateCartItemQuantity(productId, quantity);
        });
    });
    
    const quantityInputs = document.querySelectorAll('.quantity-input');
    
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            let quantity = parseInt(this.value);
            
            quantity = Math.max(1, Math.min(99, quantity));
            this.value = quantity;
            
            updateCartItemQuantity(productId, quantity);
        });
    });
    
    const clearCartBtn = document.querySelector('#clear-cart-btn');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
});