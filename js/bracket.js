// Bracket Generation and Management

// Generate matches for tournament
async function generateMatches() {
    if (currentTournament.format === 'direct') {
        await generateDirectElimination();
    } else {
        await generatePoolsFormat();
    }
}

// Generate direct elimination bracket
async function generateDirectElimination() {
    const players = [...registrations].sort((a, b) => a.seedNumber - b.seedNumber);
    
    // Determine bracket size (next power of 2)
    let bracketSize = 4;
    while (bracketSize < players.length) {
        bracketSize *= 2;
    }

    // Create first round matches
    const firstRoundMatches = [];
    const numMatches = bracketSize / 2;

    for (let i = 0; i < numMatches; i++) {
        const player1 = players[i] || null;
        const player2 = players[bracketSize - 1 - i] || null;

        if (player1 && player2) {
            const match = {
                id: generateId(),
                tournamentId: currentTournament.id,
                phase: getPhaseNameForRound(bracketSize, 1),
                matchNumber: i + 1,
                player1Id: player1.playerId,
                player1Name: player1.playerName,
                player2Id: player2.playerId,
                player2Name: player2.playerName,
                status: 'pending'
            };
            firstRoundMatches.push(match);
        }
    }

    // Create all matches in bracket
    const allMatches = [...firstRoundMatches];
    let currentRoundSize = bracketSize / 2;
    let round = 2;
    let matchCounter = 0;

    while (currentRoundSize > 1) {
        const nextRoundSize = currentRoundSize / 2;
        
        for (let i = 0; i < nextRoundSize; i++) {
            const match = {
                id: generateId(),
                tournamentId: currentTournament.id,
                phase: getPhaseNameForRound(bracketSize, round),
                matchNumber: i + 1,
                status: 'pending'
            };
            allMatches.push(match);
            matchCounter++;
        }
        
        currentRoundSize = nextRoundSize;
        round++;
    }

    // Save all matches
    for (const match of allMatches) {
        await fetch('tables/matches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(match)
        });
    }
}

// Generate pools format
async function generatePoolsFormat() {
    const players = [...registrations].sort((a, b) => a.seedNumber - b.seedNumber);
    const numPools = Math.min(4, Math.ceil(players.length / 4));
    const pools = Array.from({ length: numPools }, () => []);

    // Distribute players into pools (snake draft)
    players.forEach((player, index) => {
        const poolIndex = index % numPools;
        pools[poolIndex].push(player);
        
        // Update registration with pool group
        fetch(`tables/registrations/${player.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                poolGroup: String.fromCharCode(65 + poolIndex) // A, B, C, D
            })
        });
    });

    // Generate pool matches (round robin)
    const poolNames = ['A', 'B', 'C', 'D'];
    for (let p = 0; p < pools.length; p++) {
        const pool = pools[p];
        let matchNumber = 1;
        
        for (let i = 0; i < pool.length; i++) {
            for (let j = i + 1; j < pool.length; j++) {
                const match = {
                    id: generateId(),
                    tournamentId: currentTournament.id,
                    phase: 'pool',
                    poolGroup: poolNames[p],
                    matchNumber: matchNumber++,
                    player1Id: pool[i].playerId,
                    player1Name: pool[i].playerName,
                    player2Id: pool[j].playerId,
                    player2Name: pool[j].playerName,
                    status: 'pending'
                };

                await fetch('tables/matches', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(match)
                });
            }
        }
    }
}

// Get phase name for round
function getPhaseNameForRound(bracketSize, round) {
    const totalRounds = Math.log2(bracketSize);
    const roundsFromEnd = totalRounds - round + 1;

    if (roundsFromEnd === 0) return 'final';
    if (roundsFromEnd === 1) return 'semi';
    if (roundsFromEnd === 2) return 'quarter';
    if (roundsFromEnd === 3) return 'round_16';
    if (roundsFromEnd === 4) return 'round_32';
    
    return `round_${Math.pow(2, roundsFromEnd)}`;
}

// Display bracket tab
function displayBracketTab() {
    const tab = document.getElementById('bracketTab');

    if (currentTournament.status === 'open') {
        tab.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-info-circle" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>Le tournoi n'a pas encore commencé</h3>
                <p style="color: var(--text-light);">Le tableau sera disponible une fois que l'organisateur aura lancé le tournoi.</p>
            </div>
        `;
        return;
    }

    if (currentTournament.format === 'pools' && currentTournament.currentPhase === 'pools') {
        displayPoolsPhase(tab);
    } else {
        displayBracket(tab);
    }
}

// Display pools phase
function displayPoolsPhase(container) {
    const poolMatches = matches.filter(m => m.phase === 'pool');
    const pools = {};

    poolMatches.forEach(match => {
        if (!pools[match.poolGroup]) {
            pools[match.poolGroup] = [];
        }
        pools[match.poolGroup].push(match);
    });

    let html = '<div class="bracket-container"><h2 style="text-align: center; margin-bottom: 2rem;">Phase de Poules</h2>';
    
    Object.keys(pools).sort().forEach(poolName => {
        html += `
            <div style="margin-bottom: 3rem;">
                <h3 style="text-align: center; margin-bottom: 1rem;">Poule ${poolName}</h3>
                <div class="bracket">
                    <div class="bracket-round">
        `;

        pools[poolName].forEach(match => {
            html += createMatchHTML(match);
        });

        html += `
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Display bracket
function displayBracket(container) {
    const bracketMatches = matches.filter(m => m.phase !== 'pool');
    
    // Group matches by phase
    const phases = {
        'round_32': [],
        'round_16': [],
        'quarter': [],
        'semi': [],
        'final': []
    };

    bracketMatches.forEach(match => {
        if (phases[match.phase]) {
            phases[match.phase].push(match);
        }
    });

    // Create bracket HTML
    let html = '<div class="bracket-container"><div class="bracket">';

    const phaseNames = {
        'round_32': '1/16e de finale',
        'round_16': '1/8e de finale',
        'quarter': 'Quarts de finale',
        'semi': 'Demi-finales',
        'final': 'Finale'
    };

    Object.keys(phases).forEach(phase => {
        if (phases[phase].length > 0) {
            html += `
                <div class="bracket-round">
                    <div class="round-title">${phaseNames[phase]}</div>
            `;

            phases[phase].sort((a, b) => a.matchNumber - b.matchNumber).forEach(match => {
                html += createMatchHTML(match);
            });

            html += '</div>';
        }
    });

    html += '</div></div>';
    container.innerHTML = html;
}

// Create match HTML
function createMatchHTML(match) {
    const isCompleted = match.status === 'completed';
    const canEdit = isOrganizer && (match.player1Id && match.player2Id);

    let html = `<div class="bracket-match ${isCompleted ? 'completed' : ''}">`;

    // Player 1
    html += `
        <div class="match-player ${match.winnerId === match.player1Id ? 'winner' : ''}">
            <span class="player-name-bracket ${!match.player1Name ? 'empty' : ''}">
                ${match.player1Name || 'En attente...'}
            </span>
    `;
    
    if (isCompleted && match.player1Id) {
        html += `
            <div class="match-score">
                <span class="set-score ${getSetWinner(match, 1) === 1 ? 'won' : ''}">${match.set1Player1 || 0}</span>
                <span class="set-score ${getSetWinner(match, 2) === 1 ? 'won' : ''}">${match.set2Player1 || 0}</span>
                ${match.set3Player1 !== undefined && match.set3Player1 !== null ? `<span class="set-score ${getSetWinner(match, 3) === 1 ? 'won' : ''}">${match.set3Player1}</span>` : ''}
            </div>
        `;
    }
    
    html += '</div>';

    // Player 2
    html += `
        <div class="match-player ${match.winnerId === match.player2Id ? 'winner' : ''}">
            <span class="player-name-bracket ${!match.player2Name ? 'empty' : ''}">
                ${match.player2Name || 'En attente...'}
            </span>
    `;
    
    if (isCompleted && match.player2Id) {
        html += `
            <div class="match-score">
                <span class="set-score ${getSetWinner(match, 1) === 2 ? 'won' : ''}">${match.set1Player2 || 0}</span>
                <span class="set-score ${getSetWinner(match, 2) === 2 ? 'won' : ''}">${match.set2Player2 || 0}</span>
                ${match.set3Player2 !== undefined && match.set3Player2 !== null ? `<span class="set-score ${getSetWinner(match, 3) === 2 ? 'won' : ''}">${match.set3Player2}</span>` : ''}
            </div>
        `;
    }
    
    html += '</div>';

    // Edit button
    if (canEdit) {
        html += `
            <button class="edit-score-btn" onclick="openScoreModal('${match.id}')">
                ${isCompleted ? 'Modifier' : 'Entrer'} le score
            </button>
        `;
    }

    html += '</div>';
    return html;
}

// Get set winner
function getSetWinner(match, setNumber) {
    const p1Score = match[`set${setNumber}Player1`];
    const p2Score = match[`set${setNumber}Player2`];
    
    if (p1Score === undefined || p2Score === undefined) return 0;
    if (p1Score > p2Score) return 1;
    if (p2Score > p1Score) return 2;
    return 0;
}

// Open score modal
function openScoreModal(matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const modal = document.getElementById('scoreModal');
    const form = document.getElementById('scoreForm');

    form.innerHTML = `
        <div class="score-form-content">
            <div class="match-header">
                <div>${match.player1Name}</div>
                <div class="vs">VS</div>
                <div>${match.player2Name}</div>
            </div>

            <div class="sets-inputs">
                <div class="set-input">
                    <span class="set-label">Set 1</span>
                    <div class="score-inputs">
                        <div class="score-input-group">
                            <label>${match.player1Name}</label>
                            <input type="number" id="set1p1" min="0" value="${match.set1Player1 || ''}" required>
                        </div>
                        <span class="vs-small">-</span>
                        <div class="score-input-group">
                            <label>${match.player2Name}</label>
                            <input type="number" id="set1p2" min="0" value="${match.set1Player2 || ''}" required>
                        </div>
                    </div>
                </div>

                <div class="set-input">
                    <span class="set-label">Set 2</span>
                    <div class="score-inputs">
                        <div class="score-input-group">
                            <label>${match.player1Name}</label>
                            <input type="number" id="set2p1" min="0" value="${match.set2Player1 || ''}" required>
                        </div>
                        <span class="vs-small">-</span>
                        <div class="score-input-group">
                            <label>${match.player2Name}</label>
                            <input type="number" id="set2p2" min="0" value="${match.set2Player2 || ''}" required>
                        </div>
                    </div>
                </div>

                <div class="set-input">
                    <span class="set-label">Set 3 (si nécessaire)</span>
                    <div class="score-inputs">
                        <div class="score-input-group">
                            <label>${match.player1Name}</label>
                            <input type="number" id="set3p1" min="0" value="${match.set3Player1 || ''}">
                        </div>
                        <span class="vs-small">-</span>
                        <div class="score-input-group">
                            <label>${match.player2Name}</label>
                            <input type="number" id="set3p2" min="0" value="${match.set3Player2 || ''}">
                        </div>
                    </div>
                </div>
            </div>

            <button type="button" class="btn btn-primary btn-block" onclick="saveMatchScore('${matchId}')">
                Enregistrer le score
            </button>
        </div>
    `;

    modal.style.display = 'block';
}

// Save match score
async function saveMatchScore(matchId) {
    const match = matches.find(m => m.id === matchId);
    
    const set1p1 = parseInt(document.getElementById('set1p1').value);
    const set1p2 = parseInt(document.getElementById('set1p2').value);
    const set2p1 = parseInt(document.getElementById('set2p1').value);
    const set2p2 = parseInt(document.getElementById('set2p2').value);
    const set3p1 = document.getElementById('set3p1').value ? parseInt(document.getElementById('set3p1').value) : null;
    const set3p2 = document.getElementById('set3p2').value ? parseInt(document.getElementById('set3p2').value) : null;

    // Calculate winner
    let p1Sets = 0;
    let p2Sets = 0;
    
    if (set1p1 > set1p2) p1Sets++; else p2Sets++;
    if (set2p1 > set2p2) p1Sets++; else p2Sets++;
    if (set3p1 !== null && set3p2 !== null) {
        if (set3p1 > set3p2) p1Sets++; else p2Sets++;
    }

    const winnerId = p1Sets > p2Sets ? match.player1Id : match.player2Id;

    try {
        const updateData = {
            set1Player1: set1p1,
            set1Player2: set1p2,
            set2Player1: set2p1,
            set2Player2: set2p2,
            set3Player1: set3p1,
            set3Player2: set3p2,
            winnerId: winnerId,
            status: 'completed'
        };

        await fetch(`tables/matches/${matchId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        // Update next match if bracket
        await updateNextMatch(match, winnerId);

        alert('Score enregistré !');
        document.getElementById('scoreModal').style.display = 'none';
        await loadMatches();
        displayBracketTab();
        displayResultsTab();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// Update next match with winner
async function updateNextMatch(completedMatch, winnerId) {
    if (completedMatch.phase === 'final') {
        // Tournament completed
        await fetch(`tables/tournaments/${currentTournament.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'completed' })
        });
        return;
    }

    // Find next match
    const phaseOrder = ['round_32', 'round_16', 'quarter', 'semi', 'final'];
    const currentPhaseIndex = phaseOrder.indexOf(completedMatch.phase);
    
    if (currentPhaseIndex < 0 || currentPhaseIndex >= phaseOrder.length - 1) return;

    const nextPhase = phaseOrder[currentPhaseIndex + 1];
    const nextMatchNumber = Math.ceil(completedMatch.matchNumber / 2);
    
    const nextMatch = matches.find(m => m.phase === nextPhase && m.matchNumber === nextMatchNumber);
    
    if (nextMatch) {
        const winnerName = winnerId === completedMatch.player1Id ? completedMatch.player1Name : completedMatch.player2Name;
        const isFirstSlot = completedMatch.matchNumber % 2 === 1;

        const updateData = isFirstSlot ? {
            player1Id: winnerId,
            player1Name: winnerName
        } : {
            player2Id: winnerId,
            player2Name: winnerName
        };

        await fetch(`tables/matches/${nextMatch.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
    }
}

// Display results tab
function displayResultsTab() {
    const tab = document.getElementById('resultsTab');

    if (currentTournament.status !== 'completed') {
        tab.innerHTML = `
            <div style="text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-hourglass-half" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>Classement en attente</h3>
                <p style="color: var(--text-light);">Le classement final sera disponible une fois le tournoi terminé.</p>
            </div>
        `;
        return;
    }

    // Calculate rankings
    const rankings = calculateRankings();
    
    let html = '<div class="rankings-container">';
    html += '<h2 style="text-align: center; margin-bottom: 2rem;">Classement Final</h2>';

    // Podium
    if (rankings.length >= 3) {
        html += `
            <div class="podium">
                <div class="podium-place second">
                    <div class="podium-rank">2</div>
                    <div class="podium-name">${rankings[1].playerName}</div>
                </div>
                <div class="podium-place first">
                    <div class="podium-rank">1</div>
                    <div class="podium-name">${rankings[0].playerName}</div>
                </div>
                <div class="podium-place third">
                    <div class="podium-rank">3</div>
                    <div class="podium-name">${rankings[2].playerName}</div>
                </div>
            </div>
        `;
    }

    // Full rankings table
    html += `
        <table class="rankings-table">
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Joueur</th>
                    <th>Matchs joués</th>
                    <th>Victoires</th>
                    <th>Défaites</th>
                </tr>
            </thead>
            <tbody>
    `;

    rankings.forEach((player, index) => {
        html += `
            <tr>
                <td><span class="rank-badge">${index + 1}</span></td>
                <td>${player.playerName}</td>
                <td>${player.matchesPlayed}</td>
                <td>${player.wins}</td>
                <td>${player.losses}</td>
            </tr>
        `;
    });

    html += '</tbody></table></div>';
    tab.innerHTML = html;
}

// Calculate rankings
function calculateRankings() {
    const playerStats = {};

    registrations.forEach(reg => {
        playerStats[reg.playerId] = {
            playerId: reg.playerId,
            playerName: reg.playerName,
            matchesPlayed: 0,
            wins: 0,
            losses: 0
        };
    });

    matches.filter(m => m.status === 'completed').forEach(match => {
        if (match.player1Id && playerStats[match.player1Id]) {
            playerStats[match.player1Id].matchesPlayed++;
            if (match.winnerId === match.player1Id) {
                playerStats[match.player1Id].wins++;
            } else {
                playerStats[match.player1Id].losses++;
            }
        }

        if (match.player2Id && playerStats[match.player2Id]) {
            playerStats[match.player2Id].matchesPlayed++;
            if (match.winnerId === match.player2Id) {
                playerStats[match.player2Id].wins++;
            } else {
                playerStats[match.player2Id].losses++;
            }
        }
    });

    return Object.values(playerStats).sort((a, b) => b.wins - a.wins || a.losses - b.losses);
}

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.onclick = function() {
        this.closest('.modal').style.display = 'none';
    };
});
