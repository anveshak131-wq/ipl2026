/**
 * Team Page Player Loader
 * Loads player data from backend API or localStorage fallback
 */

// Wait for player-modal.js to load
if (!window.modalState) {
    console.log('Waiting for modal initialization...');
}

const BACKEND_API_URL = 'https://ipl-backend-api.vercel.app'; // Update with your deployed backend URL
const VERCEL_API_BASE = 'https://iplcrickethub-kappa.vercel.app';
const API_BASE = VERCEL_API_BASE; // Use Vercel API for player data

// Team code mapping (lowercase to uppercase)
const TEAM_CODE_MAP = {
    'rcb': 'RCB',
    'mi': 'MI',
    'csk': 'CSK',
    'kkr': 'KKR',
    'dc': 'DC',
    'srh': 'SRH',
    'rr': 'RR',
    'kxip': 'PBKS',
    'pbks': 'PBKS',
    'gt': 'GT',
    'lsg': 'LSG'
};

/**
 * Load players for a team page
 * @param {string} teamCode - Team code (e.g., 'rcb', 'mi', 'csk')
 */
async function loadTeamPlayers(teamCode) {
    const playersContainer = document.getElementById('playersContainer');
    if (!playersContainer) {
        console.error('Players container not found');
        return;
    }
    playersContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.7);">Loading players...</div>';
    let players = [];
    
    // Convert team code to uppercase for API
    const teamCodeUpper = TEAM_CODE_MAP[teamCode.toLowerCase()] || teamCode.toUpperCase();
    const apiUrl = `${API_BASE}/api/admin/players?team=${teamCodeUpper}`;
    
    try {
        console.log(`🔄 Fetching ${teamCodeUpper} players from Vercel API: ${apiUrl}`);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            console.error(`❌ API Error: ${response.status} ${response.statusText}`);
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(`📦 API Response for ${teamCodeUpper}:`, result);
        
        if (result) {
            const playersData = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
            console.log(`📊 Found ${playersData.length} players for ${teamCodeUpper}`);
            if (playersData.length > 0) {
                players = playersData.map(p => {
                    let stats = p.stats || {};
                    if (typeof stats === 'string') {
                        try { stats = JSON.parse(stats); } catch { stats = {}; }
                    }
                    return {
                        name: p.name,
                        team: teamCodeUpper,
                        role: p.role || p.position || 'Player',
                        age: p.age,
                        nationality: p.nationality,
                        isForeign: p.isForeign || false,
                        isCaptain: p.isCaptain || false,
                        isViceCaptain: p.isViceCaptain || false,
                        'batting style': p.battingStyle || p['batting style'] || '',
                        'bowling style': p.bowlingStyle || p['bowling style'] || '',
                        'allrounder type': p.allrounderType || p['allrounder type'] || '',
                        stats: stats,
                        jersey: p.jersey || p.number || p.jerseyNumber || null,
                        number: p.number || p.jersey || p.jerseyNumber || null,
                        photo: p.photo || p.image || null
                    };
                });
                console.log(`✅ Loaded ${players.length} players from Vercel API`);
            } else {
                console.warn('⚠️ No players found in API response');
            }
        }
    } catch (e) {
        console.error('❌ Failed to fetch from Vercel API:', e);
        console.error('Error details:', {
            message: e.message,
            stack: e.stack,
            apiUrl: `${API_BASE}/api/admin/players?team=${teamCodeUpper}`
        });
    }
    if (players.length > 0) {
        displayPlayers(players, teamCode);
    } else {
        showNoPlayersMessage(playersContainer, teamCode);
    }
}

/**
 * Display players on the page
 */
function displayPlayers(players, teamCode) {
    const playersContainer = document.getElementById('playersContainer');
    
    // Sort players by role
    const roleOrder = {
        'batsman': 1,
        'wicket-keeper': 2,
        'all-rounder': 3,
        'bowler': 4
    };
    
    players.sort((a, b) => {
        const roleA = (a.role || '').toLowerCase();
        const roleB = (b.role || '').toLowerCase();
        const orderA = roleOrder[roleA] || 99;
        const orderB = roleOrder[roleB] || 99;
        
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        
        const ageA = parseInt(a.age || 0);
        const ageB = parseInt(b.age || 0);
        return ageB - ageA;
    });
    
    // Update stats
    const playerCount = document.getElementById('playerCount');
    const foreignCount = document.getElementById('foreignCount');
    const indianCount = document.getElementById('indianCount');
    
    if (playerCount) playerCount.textContent = players.length;
    if (foreignCount) foreignCount.textContent = players.filter(p => p.isForeign).length;
    if (indianCount) indianCount.textContent = players.filter(p => !p.isForeign).length;
    
    // Create player cards
    playersContainer.innerHTML = '';
    players.forEach(player => {
        const card = createPlayerCard(player, teamCode);
        playersContainer.appendChild(card);
    });
}

/**
 * Create a player card element
 */
function createPlayerCard(player, teamCode) {
    const card = document.createElement('div');
    card.className = 'player-card-modern';
    
    let badges = '';
    if (player.isCaptain) badges += '<span class="badge-modern badge-captain">👑 Captain</span>';
    if (player.isViceCaptain) badges += '<span class="badge-modern badge-vice-captain">⭐ Vice Captain</span>';
    if (player.isForeign) badges += '<span class="badge-modern badge-overseas">🌏 Overseas</span>';
    if ((player.role || '').toLowerCase() === 'wicket-keeper' || (player.role || '').toLowerCase().includes('wicket')) {
        badges += '<span class="badge-modern badge-wk">🧤 Wicket-Keeper</span>';
    }
    
    const teamLogo = `assets/${teamCode.toLowerCase()}_logo_new.svg`;
    
    card.innerHTML = `
        <div class="player-image-wrapper">
            <div class="player-image-glow"></div>
            <div class="player-image-circle">
                <img src="${teamLogo}" alt="${player.name || 'Player'}" onerror="this.src='assets/ipl_logo_new.svg'">
            </div>
        </div>
        <h3 class="player-name">${player.name || 'Unknown'}</h3>
        <p class="player-role">${player.role || 'Player'}</p>
        <div class="player-badges-modern">
            ${badges}
        </div>
    `;
    
    // Add click event to show modal
    card.addEventListener('click', () => {
        try {
            console.log('Player card clicked:', player.name);
            
            // Ensure modal is initialized
            if (!window.modalState || !window.modalState.initialized) {
                console.log('Modal not yet initialized, initializing now...');
                if (typeof window.initModal === 'function') {
                    window.initModal();
                } else if (typeof initModal === 'function') {
                    initModal();
                }
                if (typeof window.ensureModalElements === 'function') {
                    window.ensureModalElements();
                }
            }
            
            // Ensure modal elements exist
            if (typeof window.ensureModalElements === 'function') {
                window.ensureModalElements();
            }

            // Wait a bit for modal to initialize if needed
            if (typeof window.showPlayerModal === 'function') {
                // Clone the player object to ensure we pass all data including team
                const playerData = {
                    ...player,
                    team: player.team || teamCode.toUpperCase()
                };
                console.log('Opening modal for player:', playerData);
                window.showPlayerModal(playerData);
            } else {
                console.error('showPlayerModal function not found. Waiting...');
                // Try to initialize modal again
                if (typeof window.initModal === 'function') {
                    window.initModal();
                }
                // Retry after a short delay
                setTimeout(() => {
                    if (typeof window.showPlayerModal === 'function') {
                        const playerData = {
                            ...player,
                            team: player.team || teamCode.toUpperCase()
                        };
                        console.log('Retrying to open modal for player:', playerData);
                        window.showPlayerModal(playerData);
                    } else {
                        console.error('showPlayerModal still not available after retry');
                        console.error('Available functions:', Object.keys(window).filter(k => k.includes('modal') || k.includes('Modal')));
                        alert('Player modal is not available. Please refresh the page.');
                    }
                }, 500);
            }
        } catch (error) {
            console.error('Error showing player modal:', error);
        }
    });
    card.style.cursor = 'pointer';
    
    return card;
}

/**
 * Show message when no players found
 */
function showNoPlayersMessage(container, teamCode) {
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: rgba(255,255,255,0.7);">
            <p style="font-size: 1.2rem; margin-bottom: 1rem;">🏏 No players found for ${teamCode.toUpperCase()}</p>
            <p style="font-size: 0.9rem;">Players will be available once uploaded by the admin.</p>
        </div>
    `;
    
    // Reset stats to 0
    const playerCount = document.getElementById('playerCount');
    const foreignCount = document.getElementById('foreignCount');
    const indianCount = document.getElementById('indianCount');
    
    if (playerCount) playerCount.textContent = '0';
    if (foreignCount) foreignCount.textContent = '0';
    if (indianCount) indianCount.textContent = '0';
}

// Auto-initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTeamPage);
} else {
    initTeamPage();
}

function initTeamPage() {
    // Try to detect team code from multiple sources
    let teamCode = null;
    
    // Method 1: Check data-team attribute on body
    const bodyTeam = document.body.getAttribute('data-team');
    if (bodyTeam) {
        teamCode = bodyTeam.toLowerCase();
        console.log('Detected team from data-team attribute:', teamCode);
    }
    
    // Method 2: Try to detect from page URL
    if (!teamCode) {
        const path = window.location.pathname;
        const teamMatch = path.match(/\/([a-z]{2,5})(\.html)?$/i);
        if (teamMatch) {
            teamCode = teamMatch[1].toLowerCase();
            console.log('Detected team from URL:', teamCode);
        }
    }
    
    // Method 3: Try to detect from filename (for kxip/pbks)
    if (!teamCode) {
        const filename = window.location.pathname.split('/').pop().replace('.html', '').toLowerCase();
        if (filename && TEAM_CODE_MAP[filename]) {
            teamCode = filename;
            console.log('Detected team from filename:', teamCode);
        }
    }
    
    if (teamCode) {
        // Normalize team code - use the detected code directly
        // The TEAM_CODE_MAP will handle conversion to uppercase for API
        loadTeamPlayers(teamCode);
    } else {
        console.warn('Could not detect team code. Please ensure data-team attribute is set on body tag.');
    }
}
