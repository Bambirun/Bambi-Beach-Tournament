# BBT - Bambi Beach Tournament

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-production-green)

## 🏐 Description

**BBT (Bambi Beach Tournament)** est une plateforme web complète de gestion de tournois sportifs de type beach sport. Elle permet aux organisateurs de créer et gérer des tournois avec des tableaux automatisés, et aux joueurs de s'inscrire et suivre leurs matchs en temps réel.

## ✨ Fonctionnalités Complètes

### 🔐 Système d'Authentification
- **Inscription utilisateur** avec choix de rôle :
  - **Joueur** : Peut s'inscrire et participer aux tournois
  - **Joueur & Organisateur** : Peut créer et gérer des tournois en plus de jouer
- **Connexion sécurisée** avec gestion de session
- **Profil utilisateur** avec statistiques personnalisées

### 🏆 Gestion des Tournois (Organisateurs)
- **Création de tournois** avec paramètres personnalisables :
  - Nom, date et lieu du tournoi
  - Choix du nombre de joueurs : **8, 16 ou 32 participants**
  - Choix du format :
    - **Avec Poules** : Phase de poules puis tableau à élimination
    - **Élimination Directe** : Tableau bracket dès le départ
- **Gestion des inscriptions** des joueurs
- **Lancement du tournoi** avec génération automatique des matchs
- **Saisie des scores** pour chaque match (3 sets)

### 🎯 Système de Tournoi Automatisé
- **Génération automatique des tableaux** selon le format choisi
- **Affichage visuel des brackets** style Tournify avec design moderne
- **Matchs en 3 sets** (meilleur des 3)
- **Progression automatique** des gagnants dans le tableau
- **Mise à jour en temps réel** des résultats
- **Calcul automatique du classement final**

### 👥 Fonctionnalités Joueurs
- **Inscription aux tournois** disponibles
- **Visualisation des tableaux** et des matchs
- **Suivi des scores** en temps réel
- **Profil avec statistiques** (tournois joués, matchs gagnés, etc.)

### 📊 Affichage et Classements
- **Interface de brackets visuels** inspirée de Tournify
- **Affichage des scores détaillés** par set
- **Podium des 3 premiers** avec design attractif
- **Tableau de classement complet** avec statistiques

## 🚀 Architecture Technique

### Structure du Projet
```
BBT/
├── index.html              # Page d'accueil
├── tournaments.html        # Liste des tournois
├── tournament.html         # Détail d'un tournoi avec brackets
├── create-tournament.html  # Création de tournoi (organisateurs)
├── profile.html           # Profil utilisateur
├── css/
│   ├── style.css          # Styles principaux
│   └── bracket.css        # Styles des brackets
└── js/
    ├── auth.js            # Gestion authentification
    ├── main.js            # Fonctions principales
    ├── tournaments.js     # Liste des tournois
    ├── tournament.js      # Détail du tournoi
    └── bracket.js         # Génération et gestion des brackets
```

### Modèles de Données (Tables)

#### 1. **users** - Utilisateurs
- `id` : Identifiant unique
- `username` : Nom d'utilisateur
- `email` : Email
- `password` : Mot de passe hashé
- `role` : Rôle (player / organizer)
- `firstName` : Prénom
- `lastName` : Nom de famille
- `createdAt` : Date de création du compte

#### 2. **tournaments** - Tournois
- `id` : Identifiant unique
- `name` : Nom du tournoi
- `organizerId` : ID de l'organisateur
- `organizerName` : Nom de l'organisateur
- `date` : Date du tournoi
- `location` : Lieu
- `maxPlayers` : Nombre max de joueurs (8, 16, 32)
- `format` : Format (pools / direct)
- `status` : Statut (open / in_progress / completed)
- `currentPhase` : Phase actuelle (registration / pools / brackets / finished)
- `createdAt` : Date de création

#### 3. **registrations** - Inscriptions
- `id` : Identifiant unique
- `tournamentId` : ID du tournoi
- `playerId` : ID du joueur
- `playerName` : Nom du joueur
- `seedNumber` : Numéro de seed/position
- `poolGroup` : Groupe de poule (A, B, C, D)
- `registeredAt` : Date d'inscription

#### 4. **matches** - Matchs
- `id` : Identifiant unique
- `tournamentId` : ID du tournoi
- `phase` : Phase (pool / round_32 / round_16 / quarter / semi / final)
- `matchNumber` : Numéro du match
- `player1Id` / `player1Name` : Joueur 1
- `player2Id` / `player2Name` : Joueur 2
- `set1Player1` / `set1Player2` : Scores set 1
- `set2Player1` / `set2Player2` : Scores set 2
- `set3Player1` / `set3Player2` : Scores set 3
- `winnerId` : ID du gagnant
- `status` : Statut (pending / in_progress / completed)
- `poolGroup` : Groupe de poule (si applicable)

## 🎨 Design et Interface

### Thème Beach Sport
- **Palette de couleurs** : Orange (#FF6B35), jaune (#F7931E), accents dorés
- **Typographie** : Police Poppins moderne et lisible
- **Icônes** : Font Awesome pour les symboles
- **Responsive** : Compatible mobile, tablette et desktop

### Composants Visuels
- **Brackets visuels** avec lignes de connexion
- **Cartes de tournois** avec informations clés
- **Modales élégantes** pour inscription/connexion
- **Animations fluides** et transitions douces
- **Podium 3D** pour le classement final

## 📱 Pages et Fonctionnalités

### 1. **Page d'Accueil** (`index.html`)
- Présentation de BBT
- Section caractéristiques
- Explication du fonctionnement (4 étapes)
- Appel à l'action pour inscription
- Modales de connexion/inscription

### 2. **Liste des Tournois** (`tournaments.html`)
- Affichage de tous les tournois
- Filtres par statut (ouverts / en cours / terminés)
- Cartes avec informations complètes
- Compteur de joueurs inscrits

### 3. **Détail du Tournoi** (`tournament.html`)
- **Onglet Inscriptions** :
  - Liste des joueurs inscrits
  - Bouton d'inscription (si connecté)
  - Bouton de démarrage (organisateurs)
- **Onglet Tableau** :
  - Affichage visuel des brackets
  - Saisie des scores (organisateurs)
  - Progression automatique
- **Onglet Classement** :
  - Podium des 3 premiers
  - Tableau complet avec statistiques

### 4. **Création de Tournoi** (`create-tournament.html`)
- Formulaire complet avec :
  - Informations générales (nom, date, lieu)
  - Sélection du nombre de joueurs (8, 16, 32)
  - Choix du format (poules / direct)
- Réservé aux organisateurs

### 5. **Profil Utilisateur** (`profile.html`)
- Avatar personnalisé
- Informations du compte
- Statistiques :
  - Tournois joués
  - Tournois organisés (si organisateur)
  - Matchs joués

## 🔄 Flux de Fonctionnement

### Pour un Joueur
1. **Inscription** avec rôle "Joueur"
2. **Parcours des tournois** disponibles
3. **Inscription à un tournoi** qui l'intéresse
4. **Attente du démarrage** par l'organisateur
5. **Suivi des matchs** et des résultats
6. **Consultation du classement final**

### Pour un Organisateur
1. **Inscription** avec rôle "Joueur & Organisateur"
2. **Création d'un tournoi** avec paramètres
3. **Gestion des inscriptions** des joueurs
4. **Démarrage du tournoi** (min. 4 joueurs)
5. **Génération automatique des matchs**
6. **Saisie des scores** au fur et à mesure
7. **Progression automatique** dans le tableau
8. **Finalisation** avec classement automatique

## 🛠️ Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes avec variables CSS, flexbox, grid
- **JavaScript (Vanilla)** : Logique applicative sans frameworks
- **Font Awesome** : Icônes
- **Google Fonts** : Typographie Poppins

### Stockage des Données
- **RESTful Table API** : API CRUD complète pour la gestion des données
- **LocalStorage** : Session utilisateur côté client

### Fonctionnalités JavaScript
- **Génération de brackets** : Algorithme pour tableaux à élimination
- **Gestion de poules** : Distribution snake draft des joueurs
- **Calcul automatique** : Gagnants, progression, classements
- **Interface dynamique** : Mise à jour en temps réel

## 🎯 Points Forts Techniques

### Génération de Brackets
- **Algorithme intelligent** pour créer des brackets équilibrés
- **Support de 8 à 32 joueurs** avec adaptation automatique
- **Gestion des BYE** si nombre impair de joueurs
- **Progression automatique** des gagnants au tour suivant

### Système de Scores
- **Matchs en 3 sets** (meilleur des 3)
- **Validation automatique** des scores
- **Calcul du gagnant** par sets remportés
- **Mise en évidence visuelle** des sets gagnés

### Sécurité et Permissions
- **Contrôle d'accès** par rôle utilisateur
- **Pages protégées** pour organisateurs
- **Validation côté client** des données
- **Hashage des mots de passe** (simple pour démo)

## 📈 Statistiques et Classements

### Calcul du Classement
- **Nombre de victoires** (critère principal)
- **Nombre de défaites** (critère secondaire)
- **Matchs joués** pour référence

### Affichage
- **Podium visuel** pour les 3 premiers
- **Tableau complet** avec toutes les positions
- **Badges colorés** pour les rangs

## 🌐 URLs et Navigation

### Pages Principales
- `/index.html` - Accueil
- `/tournaments.html` - Liste des tournois
- `/tournament.html?id={tournamentId}` - Détail d'un tournoi
- `/create-tournament.html` - Création de tournoi (organisateurs)
- `/profile.html` - Profil utilisateur

### API Endpoints (RESTful Table API)
- `GET /tables/tournaments` - Liste des tournois
- `GET /tables/tournaments/{id}` - Détail d'un tournoi
- `POST /tables/tournaments` - Créer un tournoi
- `PATCH /tables/tournaments/{id}` - Modifier un tournoi
- `GET /tables/registrations` - Liste des inscriptions
- `POST /tables/registrations` - S'inscrire à un tournoi
- `DELETE /tables/registrations/{id}` - Se désinscrire
- `GET /tables/matches` - Liste des matchs
- `POST /tables/matches` - Créer un match
- `PATCH /tables/matches/{id}` - Mettre à jour un match
- `GET /tables/users` - Liste des utilisateurs
- `POST /tables/users` - Créer un utilisateur

## 🚀 Fonctionnalités Complétées

✅ **Système d'authentification complet**
✅ **Gestion des profils utilisateurs**
✅ **Création et gestion des tournois**
✅ **Inscription/désinscription aux tournois**
✅ **Génération automatique des tableaux**
✅ **Format avec poules**
✅ **Format élimination directe**
✅ **Affichage visuel des brackets style Tournify**
✅ **Saisie des scores (3 sets)**
✅ **Progression automatique des gagnants**
✅ **Calcul automatique du classement**
✅ **Podium et tableau de classement**
✅ **Design responsive et moderne**
✅ **Thème beach sport avec couleurs appropriées**

## 🔮 Améliorations Futures Possibles

### Fonctionnalités Supplémentaires
- 🔔 **Notifications** : Alertes pour les matchs à venir
- 📧 **Emails** : Confirmation d'inscription, rappels
- 📸 **Photos** : Upload de photos de profil et de tournois
- 💬 **Chat** : Messagerie entre joueurs
- 🏅 **Badges** : Récompenses et achievements
- 📊 **Statistiques avancées** : Graphiques de performance
- 🌍 **Multilingue** : Support de plusieurs langues
- 📱 **PWA** : Application mobile progressive
- 🔐 **OAuth** : Connexion via Google/Facebook
- 💳 **Paiements** : Frais d'inscription en ligne

### Améliorations Techniques
- **WebSocket** pour mises à jour en temps réel
- **Cache** pour améliorer les performances
- **Compression d'images** automatique
- **Tests unitaires** et d'intégration
- **CI/CD** pour déploiement automatique

## 📝 Guide d'Utilisation Rapide

### Pour Commencer (Joueur)
1. Cliquez sur **"Inscription"** dans la barre de navigation
2. Remplissez le formulaire et choisissez **"Joueur uniquement"**
3. Une fois connecté, allez sur **"Tournois"**
4. Choisissez un tournoi et cliquez sur **"Voir le tournoi"**
5. Cliquez sur **"S'inscrire au tournoi"**
6. Attendez que l'organisateur démarre le tournoi
7. Suivez vos matchs dans l'onglet **"Tableau"**

### Pour Organiser un Tournoi
1. Inscrivez-vous avec le rôle **"Joueur et Organisateur"**
2. Cliquez sur **"Créer un tournoi"** dans la navigation
3. Remplissez les informations du tournoi
4. Choisissez le nombre de joueurs (8, 16 ou 32)
5. Sélectionnez le format (Poules ou Élimination Directe)
6. Cliquez sur **"Créer le Tournoi"**
7. Attendez que les joueurs s'inscrivent (minimum 4)
8. Cliquez sur **"Démarrer le tournoi"**
9. Dans l'onglet **"Tableau"**, cliquez sur **"Entrer le score"** pour chaque match
10. Le classement final sera automatiquement généré

## 👨‍💻 Développement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local pour le développement

### Installation Locale
```bash
# Cloner le projet
git clone [url-du-repo]

# Ouvrir avec un serveur local
# Par exemple avec Python :
python -m http.server 8000

# Ou avec Node.js :
npx serve

# Accéder à http://localhost:8000
```

## 📄 Licence

Ce projet est développé pour BBT - Bambi Beach Tournament.

---

## 🏆 Créé avec passion pour la communauté beach sport ! 🏐

**BBT** - Votre plateforme complète de gestion de tournois de beach sport 🌊☀️
