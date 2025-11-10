// Global modal state and elements
window.modalState = {
    initialized: false,
    elements: null
};

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
    'KXIP': 'assets/kxip_logo_new.svg',
    'GT': 'assets/gt_logo_new.svg',
    'LSG': 'assets/lsg_logo_new.svg'
};

// Initialize modal functionality
function initModal() {
    // Skip if already initialized
    if (window.modalState.initialized) {
        console.log('Modal already initialized');
        return;
    }
    
    console.log('Initializing modal...');
    
    // Get all required elements
    const elements = {
        modal: document.getElementById('playerModal'),
        modalName: document.getElementById('modalPlayerName'),
        modalRole: document.getElementById('modalPlayerRole'),
        modalBadges: document.getElementById('modalPlayerBadges'),
        modalDetails: document.getElementById('modalPlayerDetails'),
        modalClose: document.getElementById('modalCloseButton'),
        modalLogo: document.getElementById('modalPlayerLogo'),
        container: document.querySelector('.container'),
        header: document.querySelector('.team-header')
    };

    // Check if all essential elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element && (key === 'modal' || key === 'modalName' || key === 'modalDetails' || key === 'modalClose'))
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing essential modal elements:', missingElements);
        // Try to ensure elements exist
        ensureModalElements();
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

// Helper: ensure modal elements are present
function ensureModalElements() {
    try {
        if (!window.modalState) window.modalState = { initialized: false, elements: null };
        const elems = window.modalState.elements || {};
        
        // Re-query any missing elements
        elems.modal = elems.modal || document.getElementById('playerModal') || document.querySelector('.player-modal');
        elems.modalName = elems.modalName || document.getElementById('modalPlayerName') || document.querySelector('.modal-player-name');
        elems.modalRole = elems.modalRole || document.getElementById('modalPlayerRole') || document.querySelector('.modal-player-role');
        elems.modalBadges = elems.modalBadges || document.getElementById('modalPlayerBadges') || document.querySelector('.modal-player-badges');
        elems.modalDetails = elems.modalDetails || document.getElementById('modalPlayerDetails') || document.querySelector('.modal-player-details');
        elems.modalClose = elems.modalClose || document.getElementById('modalCloseButton') || document.querySelector('.modal-close');
        elems.modalLogo = elems.modalLogo || document.getElementById('modalPlayerLogo');
        elems.container = elems.container || document.querySelector('.container');
        elems.header = elems.header || document.querySelector('.team-header');

        window.modalState.elements = elems;
        return true;
    } catch (e) {
        console.error('ensureModalElements failed:', e);
        return false;
    }
}

// Show player modal with comprehensive stats
window.showPlayerModal = function(player) {
    // Ensure modal is initialized
    if (!window.modalState.initialized) {
        ensureModalElements();
        initModal();
    }

    // Ensure elements exist
    ensureModalElements();
    
    const elements = window.modalState?.elements || {};
    if (!elements.modal) {
        console.error('Modal element not found');
        return;
    }

    try {
        // Set player name
        if (elements.modalName) {
            elements.modalName.textContent = player.name || 'Unknown Player';
        }

        // Set player role and team
        const roleText = player.role || 'Player';
        const teamText = player.team || '';
        if (elements.modalRole) {
            elements.modalRole.textContent = teamText ? `${roleText} • ${teamText}` : roleText;
        }

        // Set team logo
        if (elements.modalLogo) {
            const teamCode = player.team || 'RCB';
            const logoPath = TEAM_LOGOS[teamCode] || TEAM_LOGOS['RCB'] || 'assets/ipl_logo_new.svg';
            elements.modalLogo.src = logoPath;
            elements.modalLogo.alt = teamCode;
            elements.modalLogo.onerror = function() {
                this.src = 'assets/ipl_logo_new.svg';
            };
        }

        // Set badges
        let badgesHTML = '';
        if (player.isCaptain) badgesHTML += '<span class="modal-badge badge-captain">👑 Captain</span>';
        if (player.isViceCaptain) badgesHTML += '<span class="modal-badge badge-captain">⭐ Vice Captain</span>';
        if (player.isForeign) badgesHTML += '<span class="modal-badge badge-foreign">🌏 Overseas</span>';
        if ((player.role || '').toLowerCase().includes('wicket') || (player.role || '').toLowerCase() === 'wicket-keeper') {
            badgesHTML += '<span class="modal-badge badge-wk">🧤 Wicket-Keeper</span>';
        }
        if (elements.modalBadges) {
            elements.modalBadges.innerHTML = badgesHTML || '<span class="modal-badge">Player</span>';
        }

        // Parse stats (handle both object and string)
        let stats = player.stats || {};
        if (typeof stats === 'string') {
            try {
                stats = JSON.parse(stats);
            } catch (e) {
                stats = {};
            }
        }

        // Get player information
        const allrounderType = player['allrounder type'] || player.allrounderType || '';
        const battingStyle = player['batting style'] || player.battingStyle || '';
        const bowlingStyle = player['bowling style'] || player.bowlingStyle || '';

        // Build details HTML
        let detailsHTML = '<div class="player-details-grid">';
        
        // Player Information Section
        detailsHTML += `
            <div class="details-section">
                <h4>Basic Information</h4>
                ${player.age ? `<div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${player.age}</div></div>` : ''}
                ${player.nationality ? `<div class="detail-item"><div class="detail-label">Nationality</div><div class="detail-value">${player.nationality}</div></div>` : ''}
                ${player.jersey || player.number ? `<div class="detail-item"><div class="detail-label">Jersey Number</div><div class="detail-value">${player.jersey || player.number}</div></div>` : ''}
                ${battingStyle ? `<div class="detail-item"><div class="detail-label">Batting Style</div><div class="detail-value">${battingStyle}</div></div>` : ''}
                ${bowlingStyle ? `<div class="detail-item"><div class="detail-label">Bowling Style</div><div class="detail-value">${bowlingStyle}</div></div>` : ''}
                ${allrounderType ? `<div class="detail-item"><div class="detail-label">All-Rounder Type</div><div class="detail-value">${allrounderType}</div></div>` : ''}
            </div>
        `;

        // Batting Statistics Section
        if (Object.keys(stats).length > 0) {
            detailsHTML += `
                <div class="details-section">
                    <h4>Batting Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${stats.matches || stats.matchesPlayed || 0}</div>
                            <div class="stat-label">Matches Played</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.innings || 0}</div>
                            <div class="stat-label">Innings</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.runs || stats.totalRuns || 0}</div>
                            <div class="stat-label">Total Runs</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.battingAvg || stats.average || '0.00'}</div>
                            <div class="stat-label">Batting Average</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.strikeRate || '0.00'}</div>
                            <div class="stat-label">Strike Rate</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.highestScore || stats.highest || 0}</div>
                            <div class="stat-label">Highest Score</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.centuries || stats.hundreds || 0}</div>
                            <div class="stat-label">Centuries (100s)</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.fifties || stats.fifty || 0}</div>
                            <div class="stat-label">Half-Centuries (50s)</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.sixes || 0}</div>
                            <div class="stat-label">Sixes (6s)</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.fours || 0}</div>
                            <div class="stat-label">Fours (4s)</div>
                        </div>
                    </div>
                </div>
            `;

            // Bowling Statistics Section
            detailsHTML += `
                <div class="details-section">
                    <h4>Bowling Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${stats.wickets || stats.totalWickets || 0}</div>
                            <div class="stat-label">Total Wickets</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.bowlingAvg || stats.bowlingAverage || '0.00'}</div>
                            <div class="stat-label">Bowling Average</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.economy || stats.economyRate || '0.00'}</div>
                            <div class="stat-label">Economy Rate</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.bestBowling || stats.best || '-'}</div>
                            <div class="stat-label">Best Bowling</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.fiveWickets || stats.fiveWicketHauls || 0}</div>
                            <div class="stat-label">5-Wicket Hauls</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.fourWickets || stats.fourWicketHauls || 0}</div>
                            <div class="stat-label">4-Wicket Hauls</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            detailsHTML += `
                <div class="details-section">
                    <div class="empty-state">
                        <h4>No statistics available for this player.</h4>
                        <p>Statistics will be displayed here once they are added by the admin.</p>
                    </div>
                </div>
            `;
        }

        detailsHTML += '</div>';

        // Set details HTML
        if (elements.modalDetails) {
            elements.modalDetails.innerHTML = detailsHTML;
        }

        // Show modal and blur background
        if (elements.modal) {
            elements.modal.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
        
        if (elements.container) {
            elements.container.classList.add('blurred');
        }
        if (elements.header) {
            elements.header.classList.add('blurred');
        }
    } catch (error) {
        console.error('Error showing player modal:', error);
    }
};

// Close player modal
window.closePlayerModal = function() {
    if (!window.modalState.initialized) {
        console.error('Modal not initialized');
        return;
    }

    const elements = window.modalState.elements || {};
    try {
        if (elements.modal) {
            elements.modal.classList.remove('active');
        }
        document.body.style.overflow = 'auto';
        
        if (elements.container) {
            elements.container.classList.remove('blurred');
        }
        if (elements.header) {
            elements.header.classList.remove('blurred');
        }
    } catch (error) {
        console.error('Error closing modal:', error);
    }
};

// Export ensureModalElements for external use
window.ensureModalElements = ensureModalElements;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initModal, 100);
    });
} else {
    setTimeout(initModal, 100);
}

// Also initialize after a delay to ensure all scripts are loaded
setTimeout(() => {
    if (!window.modalState.initialized) {
        initModal();
    }
}, 500);

