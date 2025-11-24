// Tournament Detail Page JavaScript

let currentTournament = null;
let registrations = [];
let matches = [];
let isOrganizer = false;

// Get tournament ID from URL
function getTournamentId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load tournament data
async function loadTournament() {
    const tournamentId = getTournamentId();
    if (!tournamentId) {
        alert('Tournoi non trouvé');
        window.location.href = 'tournaments.html';
        return;
    }

    try {
        const response = await fetch(`tables/tournaments/${tournamentId}`);
        currentTournament = await response.json();
        
        const user = getCurrentUser();
        isOrganizer = user && user.id === currentTournament.organizerId;

        await loadRegistrations();
        await loadMatches();
        
        displayTournamentHeader();
        displayTournamentInfo();
        displayRegistrationTab();
        displayBracketTab();
        displayResultsTab();
    } catch (error) {
        console.error('Error loading tournament:', error);
        alert('Erreur lors du chargement du tournoi');
    }
}

// Load registrations
async function loadRegistrations() {
    try {
        const response = await fetch(`tables/registrations?search=${currentTournament.id}`);
        const result = await response.json();
        registrations = result.data ? result.data.filter(r => r.tournamentId === currentTournament.id) : [];
    } catch (error) {
        console.error('Error loading registrations:', error);
        registrations = [];
    }
}

// Load matches
async function loadMatches() {
    try {
        const response = await fetch(`tables/matches?search=${currentTournament.id}`);
        const result = await response.json();
        matches = result.data ? result.data.filter(m => m.tournamentId === currentTournament.id) : [];
    } catch (error) {
        console.error('Error loading matches:', error);
        matches = [];
    }
}

// Display tournament header
function displayTournamentHeader() {
    const header = document.getElementById('tournamentHeader');
    
    const statusLabels = {
        'open': 'Inscriptions ouvertes',
        'in_progress': 'En cours',
        'completed': 'Terminé'
    };

    header.innerHTML = `
        <div class="container">
            <h1>${currentTournament.name}</h1>
            <p>${statusLabels[currentTournament.status]}</p>
        </div>
    `;
}

// Display tournament info
function displayTournamentInfo() {
    const info = document.getElementById('tournamentInfo');
    
    const date = new Date(currentTournament.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const formatLabels = {
        'pools': 'Avec Poules',
        'direct': 'Élimination Directe'
    };

    info.innerHTML = `
        <div class="tournament-info-card">
            <div class="info-box">
                <i class="fas fa-calendar-alt"></i>
                <div class="label">Date</div>
                <div class="value">${formattedDate}</div>
            </div>
            <div class="info-box">
                <i class="fas fa-map-marker-alt"></i>
                <div class="label">Lieu</div>
                <div class="value">${currentTournament.location}</div>
            </div>
            <div class="info-box">
                <i class="fas fa-user"></i>
                <div class="label">Organisateur</div>
                <div class="value">${currentTournament.organizerName}</div>
            </div>
            <div class="info-box">
                <i class="fas fa-users"></i>
                <div class="label">Joueurs</div>
                <div class="value">${registrations.length} / ${currentTournament.maxPlayers}</div>
            </div>
            <div class="info-box">
                <i class="fas fa-sitemap"></i>
                <div class="label">Format</div>
                <div class="value">${formatLabels[currentTournament.format]}</div>
            </div>
        </div>
    `;
}

// Display registration tab
function displayRegistrationTab() {
    const tab = document.getElementById('registrationTab');
    const user = getCurrentUser();
    const isRegistered = user && registrations.some(r => r.playerId === user.id);
    const isFull = registrations.length >= currentTournament.maxPlayers;

    let actionsHTML = '';
    
    if (currentTournament.status === 'open') {
        if (user) {
            if (!isRegistered && !isFull) {
                actionsHTML = `
                    <button class="btn btn-primary" onclick="registerToTournament()">
                        <i class="fas fa-user-plus"></i> S'inscrire au tournoi
                    </button>
                `;
            } else if (isRegistered) {
                actionsHTML = `
                    <button class="btn btn-danger" onclick="unregisterFromTournament()">
                        <i class="fas fa-user-minus"></i> Se désinscrire
                    </button>
                `;
            }
        } else {
            actionsHTML = `
                <p style="color: var(--text-light);">Connectez-vous pour vous inscrire</p>
            `;
        }

        if (isOrganizer && registrations.length >= 4) {
            actionsHTML += `
                <button class="btn btn-success" onclick="startTournament()">
                    <i class="fas fa-play-circle"></i> Démarrer le tournoi
                </button>
            `;
        }
    }

    let playersHTML = '';
    if (registrations.length > 0) {
        playersHTML = '<div class="players-list">';
        registrations.forEach((reg, index) => {
            playersHTML += `
                <div class="player-card">
                    <div class="player-avatar">${reg.playerName.charAt(0).toUpperCase()}</div>
                    <div class="player-info">
                        <div class="player-name">${reg.playerName}</div>
                        <div class="player-seed">Seed ${index + 1}</div>
                    </div>
                </div>
            `;
        });
        playersHTML += '</div>';
    } else {
        playersHTML = '<p style="text-align: center; color: var(--text-light); padding: 3rem;">Aucun joueur inscrit pour le moment</p>';
    }

    tab.innerHTML = `
        <div class="registration-actions">
            <div>
                <h3>Liste des joueurs inscrits (${registrations.length}/${currentTournament.maxPlayers})</h3>
            </div>
            <div style="display: flex; gap: 1rem;">
                ${actionsHTML}
            </div>
        </div>
        ${playersHTML}
    `;
}

// Register to tournament
async function registerToTournament() {
    const user = getCurrentUser();
    if (!user) {
        alert('Veuillez vous connecter pour vous inscrire');
        return;
    }

    try {
        const registration = {
            id: generateId(),
            tournamentId: currentTournament.id,
            playerId: user.id,
            playerName: `${user.firstName} ${user.lastName}`,
            seedNumber: registrations.length + 1,
            registeredAt: new Date().toISOString()
        };

        const response = await fetch('tables/registrations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registration)
        });

        if (!response.ok) throw new Error('Erreur lors de l\'inscription');

        alert('Inscription réussie !');
        await loadRegistrations();
        displayRegistrationTab();
        displayTournamentInfo();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Unregister from tournament
async function unregisterFromTournament() {
    const user = getCurrentUser();
    const registration = registrations.find(r => r.playerId === user.id);
    
    if (!registration) return;

    if (!confirm('Êtes-vous sûr de vouloir vous désinscrire ?')) return;

    try {
        const response = await fetch(`tables/registrations/${registration.id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erreur lors de la désinscription');

        alert('Désinscription réussie');
        await loadRegistrations();
        displayRegistrationTab();
        displayTournamentInfo();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Start tournament
async function startTournament() {
    if (registrations.length < 4) {
        alert('Il faut au moins 4 joueurs pour démarrer le tournoi');
        return;
    }

    if (!confirm('Démarrer le tournoi ? Les inscriptions seront fermées.')) return;

    try {
        // Update tournament status
        await fetch(`tables/tournaments/${currentTournament.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'in_progress',
                currentPhase: currentTournament.format === 'pools' ? 'pools' : 'brackets'
            })
        });

        // Generate matches
        await generateMatches();

        alert('Tournoi démarré !');
        window.location.reload();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.getAttribute('data-tab');
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        document.getElementById(tab + 'Tab').classList.add('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', loadTournament);
