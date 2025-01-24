document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordToggles = document.querySelectorAll('.toggle-password');
    
    // Gestion de l'affichage/masquage du mot de passe
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁' : '👁‍🗨';
        });
    });

    // Validation du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Vérification des mots de passe
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        // Vérification de la force du mot de passe
        if (password.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        // Simulation d'envoi du formulaire
        const submitButton = document.querySelector('.signup-button');
        submitButton.textContent = 'Creating Account...';
        submitButton.disabled = true;

        // Simuler une requête API
        setTimeout(() => {
            alert('Compte créé avec succès!');
            form.reset();
            submitButton.textContent = 'Create Account';
            submitButton.disabled = false;
        }, 2000);
    });

    // Animation des champs du formulaire
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Animation des boutons sociaux
    const socialButtons = document.querySelectorAll('.social-signup');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);

            // Simuler une connexion sociale
            const originalText = this.textContent;
            this.textContent = 'Connecting...';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});
