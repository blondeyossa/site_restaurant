document.addEventListener('DOMContentLoaded', function() {
    // Gestion des filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuSections = document.querySelectorAll('.menu-section');

    // Récupération du panier depuis le localStorage
    let cart = JSON.parse(localStorage.getItem('savoryafrique_cart')) || {
        items: [],
        total: 0
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrage des sections
            const category = button.dataset.filter;
            menuSections.forEach(section => {
                if (category === 'all' || section.dataset.category === category) {
                    section.style.display = 'block';
                    setTimeout(() => {
                        section.style.opacity = '1';
                        section.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Éléments du DOM pour le panier
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.querySelector('.cart-preview');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Afficher/Masquer le panier
    cartIcon.addEventListener('click', () => {
        cartPreview.classList.toggle('active');
    });

    // Fermer le panier en cliquant en dehors
    document.addEventListener('click', (e) => {
        if (!cartPreview.contains(e.target) && !cartIcon.contains(e.target)) {
            cartPreview.classList.remove('active');
        }
    });

    // Ajouter au panier
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.dish-card');
            const title = card.querySelector('h3').textContent;
            const price = parseFloat(card.querySelector('.price').textContent.replace('€', ''));
            const image = card.querySelector('.dish-image img').src;
            
            addToCart({
                id: button.dataset.id,
                title: title,
                price: price,
                image: image
            });

            // Animation du bouton
            button.classList.add('added');
            setTimeout(() => button.classList.remove('added'), 1000);

            // Afficher le panier après ajout
            cartPreview.classList.add('active');
            setTimeout(() => cartPreview.classList.remove('active'), 3000);
        });
    });

    function addToCart(item) {
        const existingItem = cart.items.find(i => i.id === item.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                ...item,
                quantity: 1
            });
        }
        
        updateCart();
    }

    function removeFromCart(itemId) {
        const index = cart.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            if (cart.items[index].quantity > 1) {
                cart.items[index].quantity--;
            } else {
                cart.items.splice(index, 1);
            }
        }
        updateCart();
    }

    function updateCart() {
        // Mise à jour du compteur
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Mise à jour du total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = cart.total.toFixed(2) + '€';

        // Mise à jour de la liste des articles
        cartItems.innerHTML = cart.items.length === 0 ? 
            '<p class="empty-cart">Votre panier est vide</p>' :
            cart.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price.toFixed(2)}€ x ${item.quantity}</div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            `).join('');

        // Sauvegarder le panier dans le localStorage
        localStorage.setItem('savoryafrique_cart', JSON.stringify(cart));

        // Ajout des événements de suppression
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                removeFromCart(button.dataset.id);
            });
        });

        // Mise à jour du bouton Commander
        if (checkoutBtn) {
            checkoutBtn.disabled = cart.items.length === 0;
        }
    }

    // Gestion du bouton Commander
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.items.length === 0) {
                alert('Votre panier est vide');
                return;
            }
            // Redirection vers la page de commande
            window.location.href = './order/checkout.html';
        });
    }

    // Animation des cartes au scroll
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    document.querySelectorAll('.dish-card').forEach(card => {
        observer.observe(card);
    });

    // Initialisation du panier au chargement
    updateCart();
});
