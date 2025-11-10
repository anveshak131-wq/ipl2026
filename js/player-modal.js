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
    
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
        console.log('DOM still loading, waiting...');
        document.addEventListener('DOMContentLoaded', initModal);
        return;
    }
    
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
        // Re-check after ensureModalElements
        const recoveredElements = window.modalState?.elements || {};
        if (recoveredElements.modal && recoveredElements.modalDetails) {
            elements.modal = recoveredElements.modal;
            elements.modalDetails = recoveredElements.modalDetails;
            if (recoveredElements.modalName) elements.modalName = recoveredElements.modalName;
            if (recoveredElements.modalClose) elements.modalClose = recoveredElements.modalClose;
        } else {
            console.error('Critical modal elements still missing after recovery attempt');
        }
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
        if (!window.modalState) window.modalState = { initialized: false, elements: null };
        const elems = window.modalState.elements || {};
        
        // Re-query any missing elements - always check if element exists and is valid
        if (!elems.modal || elems.modal.nodeType !== 1) {
            elems.modal = document.getElementById('playerModal') || document.querySelector('.player-modal');
        }
        if (!elems.modalName || elems.modalName.nodeType !== 1) {
            elems.modalName = document.getElementById('modalPlayerName') || document.querySelector('.modal-player-name');
        }
        if (!elems.modalRole || elems.modalRole.nodeType !== 1) {
            elems.modalRole = document.getElementById('modalPlayerRole') || document.querySelector('.modal-player-role');
        }
        if (!elems.modalBadges || elems.modalBadges.nodeType !== 1) {
            elems.modalBadges = document.getElementById('modalPlayerBadges') || document.querySelector('.modal-player-badges');
        }
        if (!elems.modalDetails || elems.modalDetails.nodeType !== 1) {
            elems.modalDetails = document.getElementById('modalPlayerDetails') || document.querySelector('.modal-player-details');
        }
        if (!elems.modalClose || elems.modalClose.nodeType !== 1) {
            elems.modalClose = document.getElementById('modalCloseButton') || document.querySelector('.modal-close');
        }
        if (!elems.modalLogo || elems.modalLogo.nodeType !== 1) {
            elems.modalLogo = document.getElementById('modalPlayerLogo');
        }
        if (!elems.container || elems.container.nodeType !== 1) {
            elems.container = document.querySelector('.container');
        }
        if (!elems.header || elems.header.nodeType !== 1) {
            elems.header = document.querySelector('.team-header');
        }

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

// Show player modal with comprehensive stats
window.showPlayerModal = function(player) {
    console.log('showPlayerModal called with player:', player);
    
    // Ensure modal is initialized
    if (!window.modalState || !window.modalState.initialized) {
        console.log('Modal not initialized, initializing now...');
        if (typeof window.ensureModalElements === 'function') {
            window.ensureModalElements();
        }
        if (typeof window.initModal === 'function') {
            window.initModal();
        } else if (typeof initModal === 'function') {
            initModal();
        }
    }

    // Ensure elements exist
    if (typeof window.ensureModalElements === 'function') {
        window.ensureModalElements();
    }
    
    let elements = window.modalState?.elements || {};
    if (!elements.modal) {
        console.error('Modal element not found. Attempting to recover...');
        // Try to recover modal elements
        if (typeof window.ensureModalElements === 'function') {
            window.ensureModalElements();
        }
        // Re-check after recovery
        const recoveredElements = window.modalState?.elements || {};
        if (!recoveredElements.modal) {
            console.error('Modal element still not found after recovery attempt');
            alert('Modal is not available. Please refresh the page.');
            return;
        }
        // Use recovered elements
        elements = recoveredElements;
        // Update modalState with recovered elements
        window.modalState.elements = elements;
    }

    // Re-query all critical elements to ensure they exist
    if (!elements.modalName) {
        elements.modalName = document.getElementById('modalPlayerName');
    }
    if (!elements.modalRole) {
        elements.modalRole = document.getElementById('modalPlayerRole');
    }
    if (!elements.modalBadges) {
        elements.modalBadges = document.getElementById('modalPlayerBadges');
    }
    if (!elements.modalDetails) {
        elements.modalDetails = document.getElementById('modalPlayerDetails');
    }
    if (!elements.modalLogo) {
        elements.modalLogo = document.getElementById('modalPlayerLogo');
    }
    if (!elements.modalClose) {
        elements.modalClose = document.getElementById('modalCloseButton');
    }

    // Final check - if critical elements are still missing, abort
    if (!elements.modal || !elements.modalDetails) {
        console.error('Critical modal elements missing:', {
            modal: !!elements.modal,
            modalDetails: !!elements.modalDetails
        });
        alert('Modal elements are not available. Please refresh the page.');
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
        } else {
            console.warn('modalBadges element not found, skipping badge display');
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

        // Set details HTML - with additional null check
        if (elements.modalDetails && elements.modalDetails.nodeType === 1) {
            elements.modalDetails.innerHTML = detailsHTML;
        } else {
            console.error('modalDetails element is null or invalid:', elements.modalDetails);
            // Try one more time to find it
            const retryElement = document.getElementById('modalPlayerDetails');
            if (retryElement) {
                retryElement.innerHTML = detailsHTML;
                elements.modalDetails = retryElement;
                window.modalState.elements = elements;
            } else {
                console.error('Could not find modalPlayerDetails element in DOM');
            }
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

