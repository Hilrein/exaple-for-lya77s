// Main JavaScript file for KLI Group website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize add to cart functionality
    initializeAddToCart();
    
    // Initialize validation for order form
    initializeOrderFormValidation();
});

/**
 * Initialize dropdown menus
 */
function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                if (dropdown !== parent) {
                    dropdown.querySelector('.dropdown-menu').classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            const dropdownMenu = parent.querySelector('.dropdown-menu');
            dropdownMenu.classList.toggle('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

/**
 * Initialize add to cart functionality with AJAX
 */
function initializeAddToCart() {
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const url = this.action;
            const csrf_token = this.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Send AJAX request
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf_token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    // Update cart count in UI
                    document.querySelector('.cart-count').textContent = data.cart_total;
                    
                    // Show success message
                    showNotification('Товар добавлен в корзину!', 'success');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Ошибка при добавлении товара в корзину.', 'error');
            });
        });
    });
}

/**
 * Initialize validation for order form
 */
function initializeOrderFormValidation() {
    const orderForm = document.querySelector('#orderModal form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            const fullNameInput = this.querySelector('[name=full_name]');
            const phoneInput = this.querySelector('[name=phone]');
            let isValid = true;
            
            // Validate full name
            if (!fullNameInput.value.trim()) {
                fullNameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                fullNameInput.classList.remove('is-invalid');
            }
            
            // Validate phone
            const phoneRegex = /^\+?[0-9]{10,15}$/;
            if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneInput.classList.remove('is-invalid');
            }
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Пожалуйста, заполните все поля правильно.', 'error');
            }
        });
    }
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'alert';
    notification.style.marginBottom = '10px';
    notification.style.minWidth = '250px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    // Set type-specific styles
    if (type === 'success') {
        notification.className += ' alert-success';
    } else if (type === 'error') {
        notification.className += ' alert-danger';
    } else {
        notification.className += ' alert-info';
    }
    
    // Set message
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.style.marginLeft = '10px';
    closeButton.addEventListener('click', function() {
        notificationContainer.removeChild(notification);
    });
    notification.appendChild(closeButton);
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
        if (notification.parentNode === notificationContainer) {
            notificationContainer.removeChild(notification);
        }
    }, 5000);
}