// Tournaments Page JavaScript

let allTournaments = [];
let currentFilter = 'all';

// Load all tournaments
async function loadTournaments() {
    try {
        const response = await fetch('tables/tournaments?sort=-createdAt');
        const result = await response.json();
        
        allTournaments = result.data || [];
        displayTournaments(allTournaments);
    } catch (error) {
        console.error('Error loading tournaments:', error);
        showEmptyState();
    }
}

// Display tournaments
async function displayTournaments(tournaments) {
    const grid = document.getElementById('tournamentsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (tournaments.length === 0) {
        showEmptyState();
        return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = '';

    for (const tournament of tournaments) {
        // Get registration count
        const registrationsResponse = await fetch(`tables/registrations?search=${tournament.id}`);
        const registrationsData = await registrationsResponse.json();
        const registrationsCount = registrationsData.data ? 
            registrationsData.data.filter(r => r.tournamentId === tournament.id).length : 0;

        const card = createTournamentCard(tournament, registrationsCount);
        grid.appendChild(card);
    }
}

// Create tournament card
function createTournamentCard(tournament, registrationsCount) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    
    const statusLabels = {
        'open': 'Inscriptions ouvertes',
        'in_progress': 'En cours',
        'completed': 'Terminé'
    };

    const formatLabels = {
        'pools': 'Avec Poules',
        'direct': 'Élimination Directe'
    };

    const date = new Date(tournament.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    card.innerHTML = `
        <div class="tournament-status status-${tournament.status}">
            ${statusLabels[tournament.status] || tournament.status}
        </div>
        
        <h3 class="tournament-name">${tournament.name}</h3>
        
        <div class="tournament-info">
            <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${formattedDate}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${tournament.location}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-user"></i>
                <span>Organisé par ${tournament.organizerName}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-sitemap"></i>
                <span>${formatLabels[tournament.format]}</span>
            </div>
        </div>
        
        <div class="tournament-footer">
            <div class="players-count">
                <i class="fas fa-users"></i>
                <span class="current">${registrationsCount}</span>
                <span>/ ${tournament.maxPlayers}</span>
            </div>
            <a href="tournament.html?id=${tournament.id}" class="btn btn-primary">
                Voir le tournoi
            </a>
        </div>
    `;

    return card;
}

// Show empty state
function showEmptyState() {
    const grid = document.getElementById('tournamentsGrid');
    const emptyState = document.getElementById('emptyState');
    const createBtn = document.getElementById('createFirstTournament');
    
    grid.innerHTML = '';
    emptyState.style.display = 'block';
    
    // Show create button only for organizers
    const user = getCurrentUser();
    if (user && user.role === 'organizer') {
        createBtn.style.display = 'inline-block';
    }
}

// Filter tournaments
function filterTournaments(filter) {
    currentFilter = filter;
    
    if (filter === 'all') {
        displayTournaments(allTournaments);
    } else {
        const filtered = allTournaments.filter(t => t.status === filter);
        displayTournaments(filtered);
    }
}

// Initialize filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterTournaments(this.getAttribute('data-filter'));
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadTournaments();
});
