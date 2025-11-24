<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Profil - BBT</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .profile-container {
            max-width: 800px;
            margin: 3rem auto;
            padding: 2rem;
            background: white;
            border-radius: 15px;
            box-shadow: var(--shadow-lg);
        }

        .profile-header {
            text-align: center;
            padding: 2rem 0;
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 2rem;
        }

        .profile-avatar {
            width: 120px;
            height: 120px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
            font-size: 3rem;
            color: white;
            font-weight: 700;
        }

        .profile-name {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .profile-role {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: var(--primary-color);
            color: white;
            border-radius: 20px;
            font-weight: 600;
        }

        .profile-info {
            margin: 2rem 0;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
        }

        .info-label {
            font-weight: 600;
            color: var(--text-dark);
        }

        .info-value {
            color: var(--text-light);
        }

        .profile-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .stat-card {
            text-align: center;
            padding: 1.5rem;
            background: var(--bg-light);
            border-radius: 10px;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: var(--text-light);
            font-weight: 500;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <i class="fas fa-volleyball-ball"></i>
                    <span>BBT</span>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="tournaments.html">Tournois</a></li>
                    <li id="createTournamentNav" style="display: none;"><a href="create-tournament.html">Créer un tournoi</a></li>
                    <li><a href="profile.html" class="active">Mon Profil</a></li>
                </ul>
                <div class="nav-actions">
                    <button id="logoutBtn" class="btn btn-outline">Déconnexion</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Profile Content -->
    <div class="container">
        <div class="profile-container">
            <div class="profile-header">
                <div class="profile-avatar" id="profileAvatar"></div>
                <h1 class="profile-name" id="profileName"></h1>
                <span class="profile-role" id="profileRole"></span>
            </div>

            <div class="profile-info">
                <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value" id="profileEmail"></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Nom d'utilisateur</span>
                    <span class="info-value" id="profileUsername"></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Membre depuis</span>
                    <span class="info-value" id="profileCreatedAt"></span>
                </div>
            </div>

            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-number" id="tournamentsPlayed">0</div>
                    <div class="stat-label">Tournois joués</div>
                </div>
                <div class="stat-card" id="tournamentsOrganizedCard" style="display: none;">
                    <div class="stat-number" id="tournamentsOrganized">0</div>
                    <div class="stat-label">Tournois organisés</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="matchesPlayed">0</div>
                    <div class="stat-label">Matchs joués</div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/auth.js"></script>
    <script src="js/main.js"></script>
    <script>
        // Load profile data
        async function loadProfile() {
            const user = getCurrentUser();
            
            if (!user) {
                window.location.href = 'index.html';
                return;
            }

            // Display user info
            document.getElementById('profileAvatar').textContent = user.firstName.charAt(0).toUpperCase();
            document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
            document.getElementById('profileRole').textContent = user.role === 'organizer' ? 'Joueur & Organisateur' : 'Joueur';
            document.getElementById('profileEmail').textContent = user.email;
            document.getElementById('profileUsername').textContent = user.username;

            // Load statistics
            try {
                // Count tournaments played
                const registrationsResponse = await fetch(`tables/registrations?search=${user.id}`);
                const registrationsData = await registrationsResponse.json();
                const tournamentsPlayed = registrationsData.data ? registrationsData.data.length : 0;
                document.getElementById('tournamentsPlayed').textContent = tournamentsPlayed;

                // Count tournaments organized (if organizer)
                if (user.role === 'organizer') {
                    document.getElementById('tournamentsOrganizedCard').style.display = 'block';
                    const tournamentsResponse = await fetch(`tables/tournaments?search=${user.id}`);
                    const tournamentsData = await tournamentsResponse.json();
                    const tournamentsOrganized = tournamentsData.data ? tournamentsData.data.filter(t => t.organizerId === user.id).length : 0;
                    document.getElementById('tournamentsOrganized').textContent = tournamentsOrganized;
                }

                // Count matches played
                const matchesResponse = await fetch('tables/matches');
                const matchesData = await matchesResponse.json();
                const matchesPlayed = matchesData.data ? matchesData.data.filter(m => 
                    m.player1Id === user.id || m.player2Id === user.id
                ).length : 0;
                document.getElementById('matchesPlayed').textContent = matchesPlayed;

            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', loadProfile);
    </script>
</body>
</html>
