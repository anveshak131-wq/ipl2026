/**
 * Simple Player Modal Handler
 * Clean implementation with proper error handling
 */

const TEAM_LOGOS = {
    'MI': 'assets/mi_logo_new.svg',
    'CSK': 'assets/csk_logo_new.svg',
    'RCB': 'assets/rcb_logo_new.svg',
    'KKR': 'assets/kkr_logo_new.svg',
    'DC': 'assets/dc_logo_new.svg',
    'SRH': 'assets/srh_logo_new.svg',
    'RR': 'assets/rr_logo_new.svg',
    'PBKS': 'assets/kxip_logo_new.svg',
    'KXIP': 'assets/kxip_logo_new.svg',
    'GT': 'assets/gt_logo_new.svg',
    'LSG': 'assets/lsg_logo_new.svg'
};

// Vercel API base URL for fetching player stats
const VERCEL_API_BASE = 'https://iplcrickethub-kappa.vercel.app';

// Global state
window.playerModalReady = false;

// Helper function to safely get element by ID
function safeGetElement(id) {
    try {
        const elem = document.getElementById(id);
        return elem && elem.nodeType === 1 ? elem : null;
    } catch (e) {
        console.error('Error getting element:', id, e);
        return null;
    }
}

// Helper function to safely set innerHTML
function safeSetInnerHTML(element, html) {
    if (!element) {
        console.warn('Attempted to set innerHTML on null element');
        return false;
    }
    if (element.nodeType !== 1) {
        console.warn('Attempted to set innerHTML on invalid element');
        return false;
    }
    try {
        element.innerHTML = html;
        return true;
    } catch (e) {
        console.error('Error setting innerHTML:', e);
        return false;
    }
}

// Helper function to safely set textContent
function safeSetTextContent(element, text) {
    if (!element || element.nodeType !== 1) {
        return false;
    }
    try {
        element.textContent = text;
        return true;
    } catch (e) {
        console.error('Error setting textContent:', e);
        return false;
    }
}

// Initialize modal functionality
function initModal() {
    // Skip if already initialized
    if (window.modalState && window.modalState.initialized) {
        console.log('Modal already initialized');
        return;
    }
    
    console.log('Initializing modal...');
    
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        console.log('DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', initModal);
        return;
    }
    
    // Get all required elements with fresh queries
    const elements = {
        modal: safeGetElement('playerModal'),
        modalName: safeGetElement('modalPlayerName'),
        modalRole: safeGetElement('modalPlayerRole'),
        modalBadges: safeGetElement('modalPlayerBadges'),
        modalDetails: safeGetElement('modalPlayerDetails'),
        modalClose: safeGetElement('modalCloseButton'),
        modalLogo: safeGetElement('modalPlayerLogo'),
        container: document.querySelector('.container'),
        header: document.querySelector('.team-header')
    };

    // Check if all essential elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element && (key === 'modal' || key === 'modalName' || key === 'modalDetails' || key === 'modalClose'))
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing essential modal elements:', missingElements);
        // Try one more time with direct queries
        if (!elements.modal) elements.modal = safeGetElement('playerModal');
        if (!elements.modalDetails) elements.modalDetails = safeGetElement('modalPlayerDetails');
        if (!elements.modalName) elements.modalName = safeGetElement('modalPlayerName');
        if (!elements.modalClose) elements.modalClose = safeGetElement('modalCloseButton');
        
        if (!elements.modal || !elements.modalDetails) {
            console.error('Critical modal elements still missing after retry');
        }
    }

    // Initialize modalState if needed
    if (!window.modalState) {
        window.modalState = { initialized: false, elements: null };
    }

    // Store elements in modal state
    window.modalState.elements = elements;
    window.modalState.initialized = true;

    // Attach close handlers
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', window.closePlayerModal);
    }
    
    if (elements.modal) {
        elements.modal.addEventListener('click', function(e) {
            if (e.target === elements.modal) {
                window.closePlayerModal();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.modal && elements.modal.classList.contains('active')) {
            window.closePlayerModal();
        }
    });

    console.log('Modal initialized successfully');
}

// Export initModal globally
window.initModal = initModal;

// Helper: ensure modal elements are present
function ensureModalElements() {
    try {
        if (!window.modalState) {
            window.modalState = { initialized: false, elements: null };
        }
        
        // Always get fresh references
        const elems = {
            modal: safeGetElement('playerModal'),
            modalName: safeGetElement('modalPlayerName'),
            modalRole: safeGetElement('modalPlayerRole'),
            modalBadges: safeGetElement('modalPlayerBadges'),
            modalDetails: safeGetElement('modalPlayerDetails'),
            modalClose: safeGetElement('modalCloseButton'),
            modalLogo: safeGetElement('modalPlayerLogo'),
            container: document.querySelector('.container'),
            header: document.querySelector('.team-header')
        };

        window.modalState.elements = elems;
        
        // Log missing critical elements
        const missing = [];
        if (!elems.modal) missing.push('modal');
        if (!elems.modalDetails) missing.push('modalDetails');
        if (missing.length > 0) {
            console.warn('Missing critical modal elements:', missing);
        }
        
        return true;
    } catch (e) {
        console.error('ensureModalElements failed:', e);
        return false;
    }
}

// Export ensureModalElements for external use
window.ensureModalElements = ensureModalElements;

// Fetch detailed player stats from Vercel API
async function fetchPlayerStatsFromVercel(playerName, teamCode) {
    try {
        const teamCodeUpper = teamCode ? teamCode.toUpperCase() : '';
        const apiUrl = `${VERCEL_API_BASE}/api/admin/players?team=${teamCodeUpper}`;
        
        console.log(`🔄 Fetching detailed stats for ${playerName} from Vercel API: ${apiUrl}`);
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            console.warn(`⚠️ API response not OK: ${response.status} ${response.statusText}`);
            return null;
        }
        
        const result = await response.json();
        const playersData = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
        
        // Find the specific player by name
        const playerData = playersData.find(p => 
            p.name && p.name.toLowerCase().trim() === playerName.toLowerCase().trim()
        );
        
        if (playerData) {
            console.log(`✅ Found detailed stats for ${playerName}`);
            return playerData;
        } else {
            console.warn(`⚠️ Player ${playerName} not found in API response`);
            return null;
        }
    } catch (error) {
        console.error('❌ Error fetching player stats from Vercel:', error);
        return null;
    }
}

// Show player modal
window.showPlayerModal = async function(player) {
    if (!player) {
        console.error('No player data provided');
        return;
    }
    
    console.log('Showing modal for:', player.name);
    
    // Get elements directly
    const modal = document.getElementById('playerModal');
    const modalName = document.getElementById('modalPlayerName');
    const modalRole = document.getElementById('modalPlayerRole');
    const modalBadges = document.getElementById('modalPlayerBadges');
    const modalDetails = document.getElementById('modalPlayerDetails');
    const modalLogo = document.getElementById('modalPlayerLogo');
    
    // Critical check
    if (!modal || !modalDetails) {
        console.error('Critical modal elements missing. Modal:', !!modal, 'Details:', !!modalDetails);
        alert('Error: Modal not loaded. Please refresh the page.');
        return;
    }
    
    try {
        // Set basic player info immediately
        if (modalName) modalName.textContent = player.name || 'Unknown Player';
        
        // Set role (will be updated after fetching detailed data)
        if (modalRole) {
            const roleText = player.role || 'Player';
            const teamText = player.team || '';
            modalRole.textContent = teamText ? `${roleText} • ${teamText}` : roleText;
        }
        
        // Set team logo
        if (modalLogo && player.team) {
            modalLogo.src = TEAM_LOGOS[player.team] || 'assets/ipl_logo_new.svg';
            modalLogo.alt = player.team;
            modalLogo.onerror = () => { modalLogo.src = 'assets/ipl_logo_new.svg'; };
        }
        
        // Show loading state
        modalDetails.innerHTML = '<div class="empty-state"><h4>Loading statistics...</h4><p>Fetching player data from Vercel storage...</p></div>';
        
        // Show modal immediately with loading state
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const container = document.querySelector('.container');
        const header = document.querySelector('.team-header');
        if (container) container.classList.add('blurred');
        if (header) header.classList.add('blurred');
        
        // Fetch detailed stats from Vercel API
        const detailedPlayerData = await fetchPlayerStatsFromVercel(player.name, player.team);
        
        // Use detailed data if available, otherwise fall back to player data
        const finalPlayerData = detailedPlayerData || player;
        
        // Update role with detailed data
        if (modalRole) {
            const roleText = finalPlayerData.role || player.role || 'Player';
            const teamText = finalPlayerData.team || player.team || '';
            modalRole.textContent = teamText ? `${roleText} • ${teamText}` : roleText;
        }
        
        // Update badges with detailed data
        let badgesHTML = '';
        const isCaptain = finalPlayerData.isCaptain || player.isCaptain;
        const isViceCaptain = finalPlayerData.isViceCaptain || player.isViceCaptain;
        const isForeign = finalPlayerData.isForeign || player.isForeign;
        const role = (finalPlayerData.role || player.role || '').toLowerCase();
        
        if (isCaptain) badgesHTML += '<span class="modal-badge">👑 Captain</span>';
        if (isViceCaptain) badgesHTML += '<span class="modal-badge">⭐ Vice Captain</span>';
        if (isForeign) badgesHTML += '<span class="modal-badge">🌏 Overseas</span>';
        if (role.includes('wicket')) badgesHTML += '<span class="modal-badge">🧤 Wicket-Keeper</span>';
        if (!badgesHTML) badgesHTML = '<span class="modal-badge">Player</span>';
        if (modalBadges) modalBadges.innerHTML = badgesHTML;
        
        // Parse stats
        let stats = finalPlayerData.stats || {};
        if (typeof stats === 'string') {
            try { stats = JSON.parse(stats); } catch (e) { stats = {}; }
        }
        
        // Build details HTML
        const battingStyle = finalPlayerData['batting style'] || finalPlayerData.battingStyle || player['batting style'] || player.battingStyle || '';
        const bowlingStyle = finalPlayerData['bowling style'] || finalPlayerData.bowlingStyle || player['bowling style'] || player.bowlingStyle || '';
        const allrounderType = finalPlayerData['allrounder type'] || finalPlayerData.allrounderType || player['allrounder type'] || player.allrounderType || '';
        
        let detailsHTML = '<div class="player-details-grid"><div class="details-section"><h4>Basic Information</h4>';
        if (finalPlayerData.age || player.age) detailsHTML += `<div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${finalPlayerData.age || player.age}</div></div>`;
        if (finalPlayerData.nationality || player.nationality) detailsHTML += `<div class="detail-item"><div class="detail-label">Nationality</div><div class="detail-value">${finalPlayerData.nationality || player.nationality}</div></div>`;
        if (finalPlayerData.jersey || finalPlayerData.number || player.jersey || player.number) detailsHTML += `<div class="detail-item"><div class="detail-label">Jersey</div><div class="detail-value">${finalPlayerData.jersey || finalPlayerData.number || player.jersey || player.number}</div></div>`;
        if (battingStyle) detailsHTML += `<div class="detail-item"><div class="detail-label">Batting</div><div class="detail-value">${battingStyle}</div></div>`;
        if (bowlingStyle) detailsHTML += `<div class="detail-item"><div class="detail-label">Bowling</div><div class="detail-value">${bowlingStyle}</div></div>`;
        if (allrounderType) detailsHTML += `<div class="detail-item"><div class="detail-label">Type</div><div class="detail-value">${allrounderType}</div></div>`;
        detailsHTML += '</div>';
        
        if (Object.keys(stats).length > 0) {
            detailsHTML += '<div class="details-section"><h4>Batting Statistics</h4><div class="stats-grid">';
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.matches || stats.matchesPlayed || 0}</div><div class="stat-label">Matches</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.innings || 0}</div><div class="stat-label">Innings</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.runs || stats.totalRuns || 0}</div><div class="stat-label">Runs</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.battingAvg || stats.average || stats.battingAverage || '0.00'}</div><div class="stat-label">Average</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.strikeRate || stats.strike_rate || '0.00'}</div><div class="stat-label">Strike Rate</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.highestScore || stats.highest || stats.highest_score || 0}</div><div class="stat-label">Highest</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.centuries || stats.hundreds || stats.century || 0}</div><div class="stat-label">100s</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.fifties || stats.fifty || stats.half_centuries || 0}</div><div class="stat-label">50s</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.sixes || stats.six || 0}</div><div class="stat-label">Sixes</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.fours || stats.four || 0}</div><div class="stat-label">Fours</div></div>`;
            detailsHTML += '</div></div>';
            
            detailsHTML += '<div class="details-section"><h4>Bowling Statistics</h4><div class="stats-grid">';
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.wickets || stats.totalWickets || stats.total_wickets || 0}</div><div class="stat-label">Wickets</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.bowlingAvg || stats.bowlingAverage || stats.bowling_avg || '0.00'}</div><div class="stat-label">Average</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.economy || stats.economyRate || stats.economy_rate || '0.00'}</div><div class="stat-label">Economy</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.bestBowling || stats.best || stats.best_bowling || '-'}</div><div class="stat-label">Best</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.fiveWickets || stats.fiveWicketHauls || stats.five_wickets || 0}</div><div class="stat-label">5-Wickets</div></div>`;
            detailsHTML += `<div class="stat-item"><div class="stat-number">${stats.fourWickets || stats.fourWicketHauls || stats.four_wickets || 0}</div><div class="stat-label">4-Wickets</div></div>`;
            detailsHTML += '</div></div>';
        } else {
            detailsHTML += '<div class="details-section"><div class="empty-state"><h4>No statistics available</h4><p>Stats will be displayed once added to the system.</p></div></div>';
        }
        detailsHTML += '</div>';
        
        // Set details - DIRECT assignment
        modalDetails.innerHTML = detailsHTML;
        
    } catch (error) {
        console.error('Error displaying modal:', error);
        modalDetails.innerHTML = '<div class="empty-state"><h4>Error loading statistics</h4><p>Unable to fetch player data. Please try again later.</p></div>';
    }
};

// Close player modal
window.closePlayerModal = function() {
    if (!window.modalState || !window.modalState.initialized) {
        console.error('Modal not initialized');
        return;
    }

    // Get fresh references
    const modal = safeGetElement('playerModal');
    const container = document.querySelector('.container');
    const header = document.querySelector('.team-header');
    
    try {
        if (modal) {
            modal.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
        
        if (container) {
            container.classList.remove('blurred');
        }
        if (header) {
            header.classList.remove('blurred');
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
};

// Initialize when DOM is loaded
function initializeModalOnLoad() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                if (typeof window.initModal === 'function') {
                    window.initModal();
                }
            }, 100);
        });
    } else {
        // DOM already loaded
        setTimeout(() => {
            if (typeof window.initModal === 'function') {
                window.initModal();
            }
        }, 100);
    }
    
    // Also initialize after a delay to ensure all scripts are loaded
    setTimeout(() => {
        if (!window.modalState || !window.modalState.initialized) {
            if (typeof window.initModal === 'function') {
                window.initModal();
            }
        }
    }, 500);
    
    // Final initialization check
    setTimeout(() => {
        if (!window.modalState || !window.modalState.initialized) {
            console.warn('Modal still not initialized after delays, forcing initialization...');
            if (typeof window.ensureModalElements === 'function') {
                window.ensureModalElements();
            }
            if (typeof window.initModal === 'function') {
                window.initModal();
            }
        } else {
            console.log('Modal initialization confirmed');
        }
    }, 1000);
}

// Start initialization
initializeModalOnLoad();
