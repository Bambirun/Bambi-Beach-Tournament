// Main JavaScript for BBT

// Modal Management
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeBtns = document.getElementsByClassName('close');

// Open login modal
if (loginBtn) {
    loginBtn.onclick = () => {
        loginModal.style.display = 'block';
    };
}

// Open register modal
if (registerBtn) {
    registerBtn.onclick = () => {
        registerModal.style.display = 'block';
    };
}

// Close modals
Array.from(closeBtns).forEach(btn => {
    btn.onclick = function() {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    };
});

// Close modal when clicking outside
window.onclick = (event) => {
    if (event.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target === registerModal) {
        registerModal.style.display = 'none';
    }
};

// Switch between login and register
document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

// Handle login form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Connexion...';

        await loginUser(email, password);
        
        showAlert('Connexion réussie !', 'success');
        setTimeout(() => {
            loginModal.style.display = 'none';
            updateUIForAuth();
            window.location.reload();
        }, 1000);
    } catch (error) {
        showAlert(error.message, 'error');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
    }
});

// Handle register form
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = {
        firstName: document.getElementById('registerFirstName').value,
        lastName: document.getElementById('registerLastName').value,
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
        role: document.getElementById('registerRole').value
    };

    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Création...';

        await registerUser(userData);
        
        showAlert('Compte créé avec succès !', 'success');
        setTimeout(() => {
            registerModal.style.display = 'none';
            updateUIForAuth();
            window.location.reload();
        }, 1000);
    } catch (error) {
        showAlert(error.message, 'error');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Créer mon compte';
    }
});

// Handle logout
if (logoutBtn) {
    logoutBtn.onclick = () => {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            logout();
        }
    };
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Check if user is logged in (for protected pages)
function requireAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Vous devez être connecté pour accéder à cette page');
        window.location.href = 'index.html';
        return false;
    }

    if (requiredRole && user.role !== requiredRole) {
        alert('Vous n\'avez pas les permissions nécessaires pour accéder à cette page');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();
});
