document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du DOM
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.checkout-step-content');
    const prevButton = document.querySelector('.prev-step');
    const nextButton = document.querySelector('.next-step');
    let currentStep = 1;

    // Récupération du panier depuis le localStorage
    let cart = JSON.parse(localStorage.getItem('savoryafrique_cart')) || { items: [], total: 0 };

    // Initialisation du panier
    function initializeCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const subtotalElement = document.querySelector('.subtotal .amount');
        const totalElement = document.querySelector('.total .amount');
        const deliveryFee = 2.99;

        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
            nextButton.disabled = true;
            // Redirection vers le menu si le panier est vide
            setTimeout(() => {
                alert('Votre panier est vide. Vous allez être redirigé vers le menu.');
                window.location.href = '../../menu/index.html';
            }, 1000);
            return;
        }

        cartItemsContainer.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image || `../../assets/images/dishes/${item.id}.jpg`}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)}€</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Mise à jour des totaux
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal + deliveryFee;

        subtotalElement.textContent = subtotal.toFixed(2) + '€';
        totalElement.textContent = total.toFixed(2) + '€';

        // Gestionnaires d'événements pour les boutons de quantité
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const item = cart.items.find(item => item.id === id);
                if (this.classList.contains('minus')) {
                    if (item.quantity > 1) {
                        item.quantity--;
                    } else {
                        cart.items = cart.items.filter(item => item.id !== id);
                    }
                } else {
                    item.quantity++;
                }
                // Mise à jour du localStorage
                localStorage.setItem('savoryafrique_cart', JSON.stringify(cart));
                initializeCart();
            });
        });
    }

    // Navigation entre les étapes
    function updateStep(direction) {
        // Validation de l'étape actuelle avant de continuer
        if (direction === 1 && !validateCurrentStep()) {
            return;
        }

        steps[currentStep - 1].classList.remove('active');
        stepContents[currentStep - 1].classList.remove('active');

        if (direction === 1) {
            steps[currentStep - 1].classList.add('completed');
            currentStep++;
        } else {
            steps[currentStep - 1].classList.remove('completed');
            currentStep--;
        }

        steps[currentStep - 1].classList.add('active');
        stepContents[currentStep - 1].classList.add('active');

        // Mise à jour des boutons
        prevButton.disabled = currentStep === 1;
        if (currentStep === steps.length) {
            nextButton.textContent = 'Commander';
        } else {
            nextButton.textContent = 'Suivant';
        }
    }

    // Validation des étapes
    function validateCurrentStep() {
        switch(currentStep) {
            case 1:
                return cart.items.length > 0;
            case 2:
                return validateDeliveryForm();
            case 3:
                return validatePaymentForm();
            default:
                return true;
        }
    }

    function validateDeliveryForm() {
        const form = document.getElementById('delivery-form');
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                showError(input, 'Ce champ est requis');
            } else {
                input.classList.remove('error');
                hideError(input);
            }
        });

        return isValid;
    }

    function validatePaymentForm() {
        const form = document.getElementById('payment-form');
        const paymentMethod = form.querySelector('input[name="payment"]:checked').value;

        if (paymentMethod === 'card') {
            const inputs = form.querySelectorAll('.card-details input[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    showError(input, 'Ce champ est requis');
                } else {
                    input.classList.remove('error');
                    hideError(input);
                }
            });

            return isValid;
        }

        return true;
    }

    function showError(input, message) {
        const errorDiv = input.parentElement.querySelector('.error-message') || 
            Object.assign(document.createElement('div'), {
                className: 'error-message'
            });
        errorDiv.textContent = message;
        if (!input.parentElement.querySelector('.error-message')) {
            input.parentElement.appendChild(errorDiv);
        }
    }

    function hideError(input) {
        const errorDiv = input.parentElement.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Formatage des champs de carte
    function setupCardFormatting() {
        const cardNumber = document.getElementById('card-number');
        const expiry = document.getElementById('expiry');
        const cvv = document.getElementById('cvv');

        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });

        expiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value.substring(0, 5);
        });

        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    // Gestionnaires d'événements
    prevButton.addEventListener('click', () => updateStep(-1));
    nextButton.addEventListener('click', () => {
        if (currentStep === steps.length) {
            // Soumission de la commande
            submitOrder();
        } else {
            updateStep(1);
        }
    });

    function submitOrder() {
        // Simulation de soumission de commande
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Traitement de votre commande...</p>
        `;
        document.body.appendChild(loadingOverlay);

        setTimeout(() => {
            // Vider le panier après la commande
            localStorage.removeItem('savoryafrique_cart');
            
            loadingOverlay.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h2>Commande confirmée !</h2>
                    <p>Votre commande a été enregistrée avec succès.</p>
                    <p>Vous recevrez un email de confirmation dans quelques minutes.</p>
                    <button onclick="window.location.href='../../index.html'">Retour à l'accueil</button>
                </div>
            `;
        }, 2000);
    }

    // Initialisation
    initializeCart();
    setupCardFormatting();
});
