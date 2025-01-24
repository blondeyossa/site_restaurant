document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets de catégories
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formationCards = document.querySelectorAll('.formation-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mise à jour des boutons actifs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrage des formations
            const category = button.dataset.category;
            formationCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Animation des cartes au chargement
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

    formationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('.contact-btn');
            const inputs = this.querySelectorAll('input, textarea');
            
            // Simulation d'envoi
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Votre message a été envoyé avec succès! Notre équipe vous contactera bientôt.');
                inputs.forEach(input => input.value = '');
                submitButton.textContent = 'Envoyer';
                submitButton.disabled = false;
            }, 1500);
        });
    }

    // Animation des cartes de bénéfices
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Gestion des boutons d'inscription
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Vous pouvez ajouter ici la logique pour rediriger vers la page d'inscription
            // ou ouvrir un modal d'inscription
            const formationTitle = this.closest('.formation-card').querySelector('h3').textContent;
            console.log(`Inscription pour la formation: ${formationTitle}`);
        });
    });
});
