/**
 * Player Statistics Manager
 * Admin interface for managing player cricket statistics
 * Fetches ONLY YOUR UPLOADED players from Vercel KV API
 */

let playersData = [];
let currentEditingPlayer = null;

// API Configuration
// Prefer a configured Cloudflare Worker endpoint if present (set in admin-upload.html)
// window.CF_API_ENDPOINT should point to the full endpoint URL that accepts team query or POST body,
// e.g. 'https://player-storage-kv.anvesh-ak-131.workers.dev/api/admin/players'
const API_ENDPOINT = (window.CF_API_ENDPOINT && window.CF_API_ENDPOINT.trim() !== '')
    ? window.CF_API_ENDPOINT.replace(/\/+$/, '') // remove trailing slash
    : `${window.location.origin}/api/admin/players`;

// Worker-only endpoint helper for POST operations. If this is null, we will NOT POST to the Pages site
// to avoid 405 responses; code should fallback to localStorage when worker endpoint is not configured.
const WORKER_API = (window.CF_API_ENDPOINT && window.CF_API_ENDPOINT.trim() !== '')
    ? window.CF_API_ENDPOINT.replace(/\/+$/, '')
    : null;

// Team logo mapping
const TEAM_LOGOS = {
    'MI': 'assets/mi_logo_new.svg',
    'CSK': 'assets/csk_logo_new.svg',
    'RCB': 'assets/rcb_logo_new.svg',
    'KKR': 'assets/kkr_logo_new.svg',
    'DC': 'assets/dc_logo_new.svg',
    'SRH': 'assets/srh_logo_new.svg',
    'RR': 'assets/rr_logo_new.svg',
    'PBKS': 'assets/kxip_logo_new.svg',
    'GT': 'assets/gt_logo_new.svg',
    'LSG': 'assets/lsg_logo_new.svg'
};

// All IPL teams
const IPL_TEAMS = ['MI', 'CSK', 'RCB', 'KKR', 'DC', 'SRH', 'RR', 'PBKS', 'GT', 'LSG'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Clear any old localStorage cache
    localStorage.removeItem('player_stats_data');
    loadPlayers();
});

// Load players from Vercel KV API
async function loadPlayers() {
    const grid = document.getElementById('playersGrid');
    grid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Loading your uploaded players...</p>
        </div>
    `;

        try {
            playersData = [];
            let debugOutput = '';
            let hasErrors = false;
            
            // Load players from Vercel KV API for all teams
            for (const team of IPL_TEAMS) {
                try {
                    const apiUrl = `${API_ENDPOINT}?team=${team}`;
                    console.log(`Loading players for ${team} from: ${apiUrl}`);
                    
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    debugOutput += `<div><b>${team}:</b> Status ${response.status}</div>`;
                    
                    if (response.ok) {
                        const contentType = response.headers.get('content-type');
                        console.log(`${team} response content-type:`, contentType);
                        
                        if (!contentType || !contentType.includes('application/json')) {
                            const text = await response.text();
                            console.warn(`${team} response is not JSON. Content: ${text.substring(0, 200)}`);
                            debugOutput += `<div style='color:red'>${team}: Worker returned non-JSON response</div>`;
                            hasErrors = true;
                            throw new Error(`Expected JSON but got ${contentType}`);
                        }
                        
                        const result = await response.json();
                        console.log(`${team} API response:`, result);
                        
                        // Handle different response formats
                        let teamPlayers = [];
                        if (result.data) {
                            teamPlayers = Array.isArray(result.data) ? result.data : [];
                        } else if (Array.isArray(result)) {
                            teamPlayers = result;
                        } else if (result.players && Array.isArray(result.players)) {
                            teamPlayers = result.players;
                        }
                        
                        debugOutput += `<div style='color:green'>${team}: Found ${teamPlayers.length} players</div>`;
                        
                        if (teamPlayers.length > 0) {
                            teamPlayers.forEach(player => {
                                if (player && player.name) {
                                    playersData.push({
                                        id: `${team}_${player.name}`,
                                        name: player.name,
                                        team: team,
                                        role: player.role || player.position || 'Player',
                                        jersey: player.number || player.jersey || null,
                                        photo: player.photo || player.image || null,
                                        age: player.age || null,
                                        nationality: player.nationality || null,
                                        battingStyle: player['batting style'] || player.battingStyle || null,
                                        bowlingStyle: player['bowling style'] || player.bowlingStyle || null,
                                        allrounderType: player['allrounder type'] || player.allrounderType || null,
                                        isCaptain: player.isCaptain || false,
                                        isViceCaptain: player.isViceCaptain || false,
                                        isForeign: player.isForeign || false,
                                        stats: player.stats || {}
                                    });
                                }
                            });
                        } else {
                            debugOutput += `<div style='color:orange'>${team}: No players found</div>`;
                        }
                    } else {
                        const errorText = await response.text();
                        debugOutput += `<div style='color:red'>${team} request failed: ${response.status} - ${errorText}</div>`;
                        hasErrors = true;
                        console.error(`${team} API error:`, response.status, errorText);
                    }
                } catch (err) {
                    debugOutput += `<div style='color:red'>Failed to load ${team} players: ${err.message}</div>`;
                    hasErrors = true;
                    console.error(`Error loading ${team} players:`, err);
                }
            }
            
            console.log(`Loaded ${playersData.length} total players from API`);
            
            // If API failed for all teams, try localStorage fallback (for static hosting)
            if (playersData.length === 0 && hasErrors) {
                console.log('API failed, trying localStorage fallback...');
                try {
                    for (const team of IPL_TEAMS) {
                        const stored = localStorage.getItem(`players_${team}`);
                        if (stored) {
                            try {
                                const teamPlayers = JSON.parse(stored);
                                if (Array.isArray(teamPlayers) && teamPlayers.length > 0) {
                                    teamPlayers.forEach(player => {
                                        if (player && player.name) {
                                            playersData.push({
                                                id: `${team}_${player.name}`,
                                                name: player.name,
                                                team: team,
                                                role: player.role || player.position || 'Player',
                                                jersey: player.number || player.jersey || null,
                                                photo: player.photo || player.image || null,
                                                age: player.age || null,
                                                nationality: player.nationality || null,
                                                battingStyle: player['batting style'] || player.battingStyle || null,
                                                bowlingStyle: player['bowling style'] || player.bowlingStyle || null,
                                                allrounderType: player['allrounder type'] || player.allrounderType || null,
                                                isCaptain: player.isCaptain || false,
                                                isViceCaptain: player.isViceCaptain || false,
                                                isForeign: player.isForeign || false,
                                                stats: player.stats || {}
                                            });
                                        }
                                    });
                                    debugOutput += `<div style='color:orange'>${team}: Loaded ${teamPlayers.length} players from localStorage</div>`;
                                }
                            } catch (e) {
                                console.warn(`Failed to parse localStorage for ${team}:`, e);
                            }
                        }
                    }
                    if (playersData.length > 0) {
                        debugOutput = `<div style='color:orange; margin-bottom: 1rem;'><b>⚠️ Using localStorage (static hosting mode)</b><br>Data is stored in your browser only.</div>` + debugOutput;
                    }
                } catch (e) {
                    console.error('localStorage fallback error:', e);
                }
            }
            
            displayPlayers(playersData);
            updateStats();
            
            // If no players found, show helpful message with debug info
            if (playersData.length === 0) {
                grid.innerHTML = `
                    <div class='empty-state' style='grid-column: 1 / -1;'>
                        <i class="fas fa-users-slash"></i>
                        <h3>No Players Found</h3>
                        <p>Upload players in the <a href="admin-upload.html" style="color: var(--secondary);">Admin Dashboard</a> first!</p>
                        ${hasErrors ? `<details style='margin-top: 1rem; text-align: left;'><summary style='cursor: pointer; color: var(--secondary);'>Debug Info</summary><div style='margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 10px; font-size: 0.9rem;'>${debugOutput}</div></details>` : ''}
                    </div>
                `;
            }
        } catch (error) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Failed to Load Players</h3>
                <p>${error}</p>
            </div>
        `;
    }
}

// Display players in grid
function displayPlayers(players) {
    const grid = document.getElementById('playersGrid');
    
    if (players.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-users-slash"></i>
                <h3>No Players Found</h3>
                <p>Upload players in the <a href="admin-upload.html" style="color: var(--secondary);">Admin Dashboard</a> first!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = players.map(player => `
        <div class="player-card" onclick="openEditPanel('${player.id}')">
            <div class="player-header">
                <div class="player-avatar" style="background: transparent; padding: 5px;">
                    <img src="${TEAM_LOGOS[player.team] || 'assets/ipl_logo_new.svg'}" 
                         alt="${player.team}" 
                         style="width: 100%; height: 100%; object-fit: contain;"
                         onerror="this.src='assets/ipl_logo_new.svg'">
                </div>
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <div class="player-role">${player.role} • ${player.team}</div>
                </div>
            </div>
            <div class="player-stats">
                <div class="stat-item">
                    <div class="stat-value">${player.stats.runs || 0}</div>
                    <div class="stat-label-small">Runs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.stats.battingAvg || 0}</div>
                    <div class="stat-label-small">Avg</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.stats.wickets || 0}</div>
                    <div class="stat-label-small">Wickets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.stats.economy || 0}</div>
                    <div class="stat-label-small">Economy</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open edit panel for a player
function openEditPanel(playerId) {
    const player = playersData.find(p => p.id === playerId);
    if (!player) return;

    currentEditingPlayer = player;

    // Update panel header
    document.getElementById('panelPlayerName').textContent = player.name;
    document.getElementById('panelPlayerRole').textContent = `${player.role} • ${player.team}`;

    // Fill form fields
    document.getElementById('editName').value = player.name;
    document.getElementById('editTeam').value = player.team;
    document.getElementById('editRole').value = player.role;
    document.getElementById('editJersey').value = player.jersey || '';
    document.getElementById('editPlayerId').value = player.id;

    // Fill stats
    const stats = player.stats || {};
    document.getElementById('editMatches').value = stats.matches || 0;
    document.getElementById('editInnings').value = stats.innings || 0;
    document.getElementById('editRuns').value = stats.runs || 0;
    document.getElementById('editBattingAvg').value = stats.battingAvg || 0;
    document.getElementById('editStrikeRate').value = stats.strikeRate || 0;
    document.getElementById('editHighestScore').value = stats.highestScore || 0;
    document.getElementById('editCenturies').value = stats.centuries || 0;
    document.getElementById('editFifties').value = stats.fifties || 0;
    document.getElementById('editSixes').value = stats.sixes || 0;
    document.getElementById('editFours').value = stats.fours || 0;
    document.getElementById('editWickets').value = stats.wickets || 0;
    document.getElementById('editBowlingAvg').value = stats.bowlingAvg || 0;
    document.getElementById('editEconomy').value = stats.economy || 0;
    document.getElementById('editBestBowling').value = stats.bestBowling || '';
    document.getElementById('editFiveWickets').value = stats.fiveWickets || 0;
    document.getElementById('editFourWickets').value = stats.fourWickets || 0;

    // Open panel
    document.getElementById('editPanel').classList.add('open');
}

// Close edit panel
function closePanel() {
    document.getElementById('editPanel').classList.remove('open');
    currentEditingPlayer = null;
}

// Save player stats back to localStorage
async function savePlayerStats(event) {
    event.preventDefault();

    const playerId = document.getElementById('editPlayerId').value;
    const playerIndex = playersData.findIndex(p => p.id === playerId);

    if (playerIndex === -1) {
        showToast('Player not found!', false);
        return;
    }

    const player = playersData[playerIndex];
    const team = document.getElementById('editTeam').value;

    // Update player data
    const updatedPlayer = {
        ...player,
        name: document.getElementById('editName').value,
        team: team,
        role: document.getElementById('editRole').value,
        jersey: parseInt(document.getElementById('editJersey').value) || null,
        stats: {
            matches: parseInt(document.getElementById('editMatches').value) || 0,
            innings: parseInt(document.getElementById('editInnings').value) || 0,
            runs: parseInt(document.getElementById('editRuns').value) || 0,
            battingAvg: parseFloat(document.getElementById('editBattingAvg').value) || 0,
            strikeRate: parseFloat(document.getElementById('editStrikeRate').value) || 0,
            highestScore: parseInt(document.getElementById('editHighestScore').value) || 0,
            centuries: parseInt(document.getElementById('editCenturies').value) || 0,
            fifties: parseInt(document.getElementById('editFifties').value) || 0,
            sixes: parseInt(document.getElementById('editSixes').value) || 0,
            fours: parseInt(document.getElementById('editFours').value) || 0,
            wickets: parseInt(document.getElementById('editWickets').value) || 0,
            bowlingAvg: parseFloat(document.getElementById('editBowlingAvg').value) || 0,
            economy: parseFloat(document.getElementById('editEconomy').value) || 0,
            bestBowling: document.getElementById('editBestBowling').value,
            fiveWickets: parseInt(document.getElementById('editFiveWickets').value) || 0,
            fourWickets: parseInt(document.getElementById('editFourWickets').value) || 0
        }
    };

    try {
        // Get all players for this team from API, fallback to localStorage
        let teamPlayers = [];
            try {
                const response = await fetch(`${API_ENDPOINT}?team=${team}`);
            if (response.ok) {
                const result = await response.json();
                teamPlayers = result.data || result || [];
            } else {
                throw new Error('API failed, trying localStorage');
            }
        } catch (apiError) {
            // Fallback to localStorage for static hosting
            console.log('API load failed, using localStorage:', apiError);
            const stored = localStorage.getItem(`players_${team}`);
            if (stored) {
                teamPlayers = JSON.parse(stored);
            }
        }

        // Update the player in the team array (update existing or add new)
        const index = teamPlayers.findIndex(p => p.name === player.name);
        const playerPayload = {
            name: updatedPlayer.name,
            role: updatedPlayer.role,
            number: updatedPlayer.jersey || updatedPlayer.number || null,
            jersey: updatedPlayer.jersey || updatedPlayer.number || null,
            age: updatedPlayer.age || updatedPlayer.stats?.age || null,
            nationality: updatedPlayer.nationality || null,
            isCaptain: updatedPlayer.isCaptain || false,
            isViceCaptain: updatedPlayer.isViceCaptain || false,
            isForeign: updatedPlayer.isForeign || false,
            photo: updatedPlayer.photo || null,
            stats: updatedPlayer.stats || {}
        };

        if (index !== -1) {
            // Update existing player entry
            teamPlayers[index] = {
                ...teamPlayers[index],
                ...playerPayload
            };
        } else {
            // Player not found in stored array - add as new entry
            teamPlayers.push(playerPayload);
        }

        // Try to save to API first, fallback to localStorage for static hosting
            try {
                if (!WORKER_API) {
                    // Worker endpoint not configured - skip POST to Pages site which returns 405.
                    console.warn('CF_API_ENDPOINT not set; skipping POST to remote API. Saving locally.');
                    localStorage.setItem(`players_${team}`, JSON.stringify(teamPlayers));
                } else {
                    const saveResponse = await fetch(WORKER_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ team, players: teamPlayers })
                    });

                    if (!saveResponse.ok) {
                        throw new Error('API save failed, using localStorage');
                    }
                }
            } catch (apiError) {
                // Fallback to localStorage for static hosting or API failure
                console.log('API save failed or skipped, using localStorage fallback:', apiError);
                localStorage.setItem(`players_${team}`, JSON.stringify(teamPlayers));
            }

        // Update local data
        playersData[playerIndex] = updatedPlayer;
        
        // Reload display
        displayPlayers(playersData);
        updateStats();
        
        // Close panel
        closePanel();
        
        showToast('✅ Player stats updated successfully!', true);

    } catch (error) {
        console.error('Save error:', error);
        showToast('❌ Failed to save player stats. Please try again.', false);
    }
}

// Delete player from localStorage
async function deletePlayer() {
    if (!currentEditingPlayer) return;

    if (!confirm(`Delete ${currentEditingPlayer.name}? This action cannot be undone.`)) {
        return;
    }

    const player = currentEditingPlayer;
    const team = player.team;

    try {
        // Get all players for this team from API, fallback to localStorage
        let teamPlayers = [];
        try {
            const response = await fetch(`${API_ENDPOINT}?team=${team}`);
            if (response.ok) {
                const result = await response.json();
                teamPlayers = result.data || result || [];
            } else {
                throw new Error('API failed, trying localStorage');
            }
        } catch (apiError) {
            // Fallback to localStorage for static hosting
            console.log('API load failed, using localStorage:', apiError);
            const stored = localStorage.getItem(`players_${team}`);
            if (stored) {
                teamPlayers = JSON.parse(stored);
            }
        }

        // Remove the player from the team array
        teamPlayers = teamPlayers.filter(p => p.name !== player.name);

        // Try to save to API first, fallback to localStorage for static hosting
        try {
            if (!WORKER_API) {
                console.warn('CF_API_ENDPOINT not set; skipping POST to remote API. Saving locally.');
                localStorage.setItem(`players_${team}`, JSON.stringify(teamPlayers));
            } else {
                const saveResponse = await fetch(WORKER_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ team, players: teamPlayers })
                });

                if (!saveResponse.ok) {
                    throw new Error('API save failed, using localStorage');
                }
            }
        } catch (apiError) {
            console.log('API save failed or skipped, using localStorage fallback:', apiError);
            localStorage.setItem(`players_${team}`, JSON.stringify(teamPlayers));
        }

        // Remove from local data
        playersData = playersData.filter(p => p.id !== player.id);
        
        // Reload display
        displayPlayers(playersData);
        updateStats();
        
        // Close panel
        closePanel();
        
        showToast('✅ Player deleted successfully!', true);

    } catch (error) {
        console.error('Delete error:', error);
        showToast('❌ Failed to delete player. Please try again.', false);
    }
}

// Filter players
function filterPlayers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const teamFilter = document.getElementById('filterTeam').value;
    const roleFilter = document.getElementById('filterRole').value;

    let filtered = playersData;

    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }

    // Team filter
    if (teamFilter) {
        filtered = filtered.filter(p => p.team === teamFilter);
    }

    // Role filter
    if (roleFilter) {
        filtered = filtered.filter(p => p.role === roleFilter);
    }

    displayPlayers(filtered);
}

// Update statistics
function updateStats() {
    document.getElementById('totalPlayers').textContent = playersData.length;
    
    const batsmen = playersData.filter(p => p.role === 'Batsman' || p.role === 'Wicket-Keeper').length;
    const bowlers = playersData.filter(p => p.role === 'Bowler').length;
    const allrounders = playersData.filter(p => p.role === 'All-Rounder').length;
    
    document.getElementById('totalBatsmen').textContent = batsmen;
    document.getElementById('totalBowlers').textContent = bowlers;
    document.getElementById('totalAllrounders').textContent = allrounders;
}

// Export players data
function exportPlayers() {
    if (playersData.length === 0) {
        showToast('No players to export!', false);
        return;
    }

    const dataStr = JSON.stringify(playersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ipl_player_stats_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('✅ Data exported successfully!', true);
}

// Show toast notification
function showToast(message, success = true) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.className = success ? 'toast show' : 'toast show error';
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Export functions for HTML
window.openEditPanel = openEditPanel;
window.closePanel = closePanel;
window.savePlayerStats = savePlayerStats;
window.deletePlayer = deletePlayer;
window.filterPlayers = filterPlayers;
window.exportPlayers = exportPlayers;
