let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;
const deliveryCost = 150;

document.addEventListener('DOMContentLoaded', function () {
    updateCartDisplay();
    setupFilters();
});

/* ===== ФИЛЬТРЫ ===== */
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pizzaCards = document.querySelectorAll('.pizza-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;

            pizzaCards.forEach(card => {
                if (category === 'all' || card.dataset.category.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ===== КОРЗИНА ===== */
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${name} добавлена в корзину!`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(name);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center">Корзина пуста</p>';
        subtotalEl.textContent = '0 ₽';
        totalEl.textContent = deliveryCost + ' ₽';
        return;
    }

    let subtotal = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        cartItems.innerHTML += `
        <div class="cart-item d-flex justify-content-between align-items-center">
            <div>
                <h6>${item.name}</h6>
                <p class="text-muted">${item.price} ₽ × ${item.quantity}</p>
            </div>
            <div>
                <button onclick="updateQuantity('${item.name}', -1)">-</button>
                <button onclick="updateQuantity('${item.name}', 1)">+</button>
                <button onclick="removeFromCart('${item.name}')">✕</button>
            </div>
        </div>`;
    });

    const delivery = subtotal >= 1000 ? 0 : deliveryCost;
    subtotalEl.textContent = subtotal + ' ₽';
    totalEl.textContent = subtotal + delivery + ' ₽';
}

/* ===== ОФОРМЛЕНИЕ ===== */
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (cart.length === 0) {
        alert('Добавьте товары в корзину');
        return;
    }

    if (!this.checkValidity()) {
        this.classList.add('was-validated');
        return;
    }

    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';

    cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
});

/* ===== УВЕДОМЛЕНИЕ ===== */
function showNotification(message) {
    const n = document.createElement('div');
    n.className = 'position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white rounded';
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}
