// Authentication and User Management

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('bbt_currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Set current user in localStorage
function setCurrentUser(user) {
    localStorage.setItem('bbt_currentUser', JSON.stringify(user));
}

// Clear current user
function logout() {
    localStorage.removeItem('bbt_currentUser');
    updateUIForAuth();
    window.location.href = 'index.html';
}

// Simple password hashing (for demo purposes - in production use proper hashing)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
}

// Register new user
async function registerUser(userData) {
    try {
        // Check if user already exists
        const response = await fetch(`tables/users?search=${userData.email}`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            throw new Error('Un compte avec cet email existe déjà');
        }

        // Create new user
        const newUser = {
            id: generateId(),
            username: userData.username,
            email: userData.email,
            password: hashPassword(userData.password),
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            createdAt: new Date().toISOString()
        };

        const createResponse = await fetch('tables/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser)
        });

        if (!createResponse.ok) {
            throw new Error('Erreur lors de la création du compte');
        }

        const createdUser = await createResponse.json();
        
        // Auto login
        setCurrentUser({
            id: createdUser.id,
            username: createdUser.username,
            email: createdUser.email,
            role: createdUser.role,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName
        });

        return createdUser;
    } catch (error) {
        throw error;
    }
}

// Login user
async function loginUser(email, password) {
    try {
        const response = await fetch(`tables/users?search=${email}`);
        const result = await response.json();

        if (!result.data || result.data.length === 0) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const user = result.data[0];
        const hashedPassword = hashPassword(password);

        if (user.password !== hashedPassword) {
            throw new Error('Email ou mot de passe incorrect');
        }

        // Set current user
        setCurrentUser({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        });

        return user;
    } catch (error) {
        throw error;
    }
}

// Update UI based on authentication status
function updateUIForAuth() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const createTournamentNav = document.getElementById('createTournamentNav');
    const profileNav = document.getElementById('profileNav');

    if (user) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (profileNav) profileNav.style.display = 'block';
        
        // Show create tournament link only for organizers
        if (createTournamentNav && user.role === 'organizer') {
            createTournamentNav.style.display = 'block';
        }
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (createTournamentNav) createTournamentNav.style.display = 'none';
        if (profileNav) profileNav.style.display = 'none';
    }
}

// Generate unique ID
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    const container = document.querySelector('.modal-content form');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 4000);
    }
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();
});
