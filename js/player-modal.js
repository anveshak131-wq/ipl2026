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

// Show player modal with comprehensive stats
window.showPlayerModal = function(player) {
    console.log('showPlayerModal called with player:', player);
    
    if (!player) {
        console.error('No player data provided');
        return;
    }
    
    // Always ensure elements exist - get fresh references
    ensureModalElements();
    
    // Get fresh element references right before use
    const modal = safeGetElement('playerModal');
    const modalName = safeGetElement('modalPlayerName');
    const modalRole = safeGetElement('modalPlayerRole');
    const modalBadges = safeGetElement('modalPlayerBadges');
    const modalDetails = safeGetElement('modalPlayerDetails');
    const modalLogo = safeGetElement('modalPlayerLogo');
    const modalClose = safeGetElement('modalCloseButton');
    const container = document.querySelector('.container');
    const header = document.querySelector('.team-header');
    
    // Critical check - if modal or modalDetails don't exist, abort
    if (!modal) {
        console.error('Modal element not found in DOM');
        alert('Modal is not available. Please refresh the page.');
        return;
    }
    
    if (!modalDetails) {
        console.error('Modal details element not found in DOM');
        alert('Modal details element is not available. Please refresh the page.');
        return;
    }

    try {
        // Set player name - get fresh reference
        safeSetTextContent(modalName, player.name || 'Unknown Player');

        // Set player role and team - get fresh reference
        const roleText = player.role || 'Player';
        const teamText = player.team || '';
        const roleDisplay = teamText ? `${roleText} • ${teamText}` : roleText;
        safeSetTextContent(modalRole, roleDisplay);

        // Set team logo - get fresh reference
        if (modalLogo) {
            const teamCode = player.team || 'RCB';
            const logoPath = TEAM_LOGOS[teamCode] || TEAM_LOGOS['RCB'] || 'assets/ipl_logo_new.svg';
            modalLogo.src = logoPath;
            modalLogo.alt = teamCode;
            modalLogo.onerror = function() {
                this.src = 'assets/ipl_logo_new.svg';
            };
        }

        // Set badges - get fresh reference and use safe function
        let badgesHTML = '';
        if (player.isCaptain) badgesHTML += '<span class="modal-badge badge-captain">👑 Captain</span>';
        if (player.isViceCaptain) badgesHTML += '<span class="modal-badge badge-captain">⭐ Vice Captain</span>';
        if (player.isForeign) badgesHTML += '<span class="modal-badge badge-foreign">🌏 Overseas</span>';
        if ((player.role || '').toLowerCase().includes('wicket') || (player.role || '').toLowerCase() === 'wicket-keeper') {
            badgesHTML += '<span class="modal-badge badge-wk">🧤 Wicket-Keeper</span>';
        }
        if (!badgesHTML) {
            badgesHTML = '<span class="modal-badge">Player</span>';
        }
        
        // Get fresh reference for badges before setting
        const badgesElement = safeGetElement('modalPlayerBadges');
        if (!safeSetInnerHTML(badgesElement, badgesHTML)) {
            console.warn('Failed to set badges HTML');
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

        // Set details HTML - get fresh reference right before setting
        const detailsElement = safeGetElement('modalPlayerDetails');
        if (!safeSetInnerHTML(detailsElement, detailsHTML)) {
            console.error('Failed to set modal details HTML. Element:', detailsElement);
            // Last resort - try direct query
            const lastTry = document.getElementById('modalPlayerDetails');
            if (lastTry && lastTry.nodeType === 1) {
                lastTry.innerHTML = detailsHTML;
            } else {
                console.error('Could not set modal details - element not found in DOM');
            }
        }

        // Show modal and blur background
        if (modal) {
            modal.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
        
        if (container) {
            container.classList.add('blurred');
        }
        if (header) {
            header.classList.add('blurred');
        }
        
        // Update modalState with fresh references
        if (window.modalState) {
            window.modalState.elements = {
                modal: modal,
                modalName: modalName,
                modalRole: modalRole,
                modalBadges: badgesElement,
                modalDetails: detailsElement || safeGetElement('modalPlayerDetails'),
                modalClose: modalClose,
                modalLogo: modalLogo,
                container: container,
                header: header
            };
        }
    } catch (error) {
        console.error('Error showing player modal:', error);
        console.error('Error stack:', error.stack);
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
