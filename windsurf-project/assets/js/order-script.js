document.addEventListener('DOMContentLoaded', function() {
    // Animation pour la barre de recherche
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchInput.addEventListener('focus', () => {
            searchInput.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.1)';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.style.boxShadow = 'none';
        });

        searchBtn.addEventListener('click', () => {
            // Ici, vous pouvez ajouter la logique de recherche
            console.log('Recherche:', searchInput.value);
        });
    }

    // Animation pour les cartes d'étapes
    const stepCards = document.querySelectorAll('.step-card');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Gestion des boutons d'action
    const actionButtons = document.querySelectorAll('.option-card button, .explore-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Animation du bouton
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 100);

            // Ici, vous pouvez ajouter la logique spécifique à chaque bouton
            console.log('Action button clicked:', button.textContent);
        });
    });
});
