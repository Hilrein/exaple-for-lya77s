document.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
    initializeAddToCart();
    initializeOrderFormValidation();
});

function initializeDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', e => {
            e.preventDefault();
            const parent = toggle.closest('.dropdown');

            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (!parent.contains(menu)) {
                    menu.classList.remove('show');
                }
            });

            const dropdownMenu = parent.querySelector('.dropdown-menu');
            dropdownMenu?.classList.toggle('show');
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
}

function initializeAddToCart() {
    const forms = document.querySelectorAll('.add-to-cart-form');

    forms.forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const url = form.action;
            const csrfToken = form.querySelector('[name=csrfmiddlewaretoken]')?.value;

            if (!csrfToken) return;

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) cartCount.textContent = data.cart_total;
                    showNotification('Товар добавлен в корзину!', 'success');
                } else {
                    showNotification('Произошла ошибка. Попробуйте снова.', 'error');
                }
            })
            .catch(() => {
                showNotification('Ошибка при добавлении товара в корзину.', 'error');
            });
        });
    });
}

function initializeOrderFormValidation() {
    const form = document.querySelector('#orderModal form');
    if (!form) return;

    form.addEventListener('submit', e => {
        const fullName = form.querySelector('[name=full_name]');
        const phone = form.querySelector('[name=phone]');
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        let isValid = true;

        if (!fullName.value.trim()) {
            fullName.classList.add('is-invalid');
            isValid = false;
        } else {
            fullName.classList.remove('is-invalid');
        }

        if (!phoneRegex.test(phone.value.trim())) {
            phone.classList.add('is-invalid');
            isValid = false;
        } else {
            phone.classList.remove('is-invalid');
        }

        if (!isValid) {
            e.preventDefault();
            showNotification('Пожалуйста, заполните все поля правильно.', 'error');
        }
    });
}

function showNotification(message, type = 'info') {
    let container = document.getElementById('notification-container');

    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999'
        });
        document.body.appendChild(container);
    }

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = 'margin-bottom:10px; min-width:250px; box-shadow:0 4px 8px rgba(0,0,0,0.1);';
    alert.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.style.marginLeft = '10px';
    closeBtn.onclick = () => alert.remove();

    alert.appendChild(closeBtn);
    container.appendChild(alert);

    setTimeout(() => alert.remove(), 5000);
}