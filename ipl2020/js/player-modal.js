// Global modal state and elements
window.modalState = {
    initialized: false,
    elements: null
};

// Initialize modal functionality
function initModal() {
    // Initialize modal elements
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
        container: document.querySelector('.container'),
        header: document.querySelector('.team-header')
    };

    // Diagnostic overlay for modal elements (safe: after elements are collected)
    try {
        let diag = document.createElement('div');
        diag.style = 'position:fixed;bottom:0;left:0;right:0;background:#222;color:#fff;z-index:99999;padding:1rem;font-size:1rem;opacity:0.95;';
        diag.innerHTML = '<b>Modal Diagnostic:</b><br>';
        Object.entries(elements).forEach(([key, el]) => {
            diag.innerHTML += key + ': ' + (el ? 'FOUND' : '<span style="color:red">MISSING</span>') + '<br>';
        });
        document.body.appendChild(diag);
    } catch (e) {
        console.warn('Modal diagnostic failed:', e);
    }

    // Check if all elements exist and log them
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    Object.entries(elements).forEach(([key, el]) => {
        if (!el) {
            console.error(`Modal element missing: ${key}`);
        } else {
            console.log(`Modal element found: ${key}`);
        }
    });

    if (missingElements.length > 0) {
        let err = document.createElement('div');
        err.style = 'color:red;background:#fff;padding:1rem;text-align:center;position:fixed;top:0;left:0;right:0;z-index:99999;font-size:1.2rem;';
        err.innerText = 'Modal initialization failed. Missing elements: ' + missingElements.join(', ');
        // Define showPlayerModal globally (resilient)
        window.showPlayerModal = function(player) {
            // Try to ensure elements exist (recover if init missed them)
            if (typeof ensureModalElements === 'function') ensureModalElements();

            const elements = window.modalState?.elements || {};
            if (!elements) {
                console.error('Modal elements unavailable');
                return;
            }

            try {
                // Set basic info
                if (elements.modalName) elements.modalName.textContent = player.name || 'Unknown Player';
                if (elements.modalRole) elements.modalRole.textContent = player.role || 'Player';

                // Set badges
                let badgesHTML = '';
                if (player.isCaptain) badgesHTML += '<span class="modal-badge badge-captain">👑 Captain</span>';
                if (player.isViceCaptain) badgesHTML += '<span class="modal-badge badge-captain">⭐ Vice Captain</span>';
                if (player.isForeign) badgesHTML += '<span class="modal-badge badge-foreign">🌏 Overseas</span>';
                if ((player.role || '').toLowerCase() === 'wicket-keeper') badgesHTML += '<span class="modal-badge badge-wk">🧤 Wicket-Keeper</span>';
                if (elements.modalBadges) elements.modalBadges.innerHTML = badgesHTML;

                // Set player details and stats
                const allrounderType = player['allrounder type'] || player['Allrounder Type'] || '';
                const stats = player.stats || {};

                let detailsHTML = '<div class="player-details-grid">';
            
                // Player Information
                detailsHTML += `
                    <div class="details-section">
                        <h4>Player Information</h4>
                        ${player.age ? `<div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${player.age}</div></div>` : ''}
                        ${player.nationality ? `<div class="detail-item"><div class="detail-label">Nationality</div><div class="detail-value">${player.nationality}</div></div>` : ''}
                        ${player.jersey ? `<div class="detail-item"><div class="detail-label">Jersey Number</div><div class="detail-value">${player.jersey}</div></div>` : ''}
                        ${player['batting style'] || player.Batting ? `<div class="detail-item"><div class="detail-label">Batting Style</div><div class="detail-value">${player['batting style'] || player.Batting}</div></div>` : ''}
                        ${player['bowling style'] || player.Bowling ? `<div class="detail-item"><div class="detail-label">Bowling Style</div><div class="detail-value">${player['bowling style'] || player.Bowling}</div></div>` : ''}
                        ${allrounderType ? `<div class="detail-item"><div class="detail-label">All-Rounder Type</div><div class="detail-value">${allrounderType}</div></div>` : ''}
                    </div>
                `;

                if (Object.keys(stats).length > 0) {
                    // Batting Stats
                    detailsHTML += `
                        <div class="details-section">
                            <h4>Batting Statistics</h4>
                            <div class="stats-grid">
                                <div class="stat-item"><div class="stat-number">${stats.matches || 0}</div><div class="stat-label">Matches</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.runs || 0}</div><div class="stat-label">Runs</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.battingAvg || '0.00'}</div><div class="stat-label">Average</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.strikeRate || '0.00'}</div><div class="stat-label">Strike Rate</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.highestScore || 0}</div><div class="stat-label">Highest Score</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.centuries || 0}</div><div class="stat-label">Centuries</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.fifties || 0}</div><div class="stat-label">Half-Centuries</div></div>
                            </div>
                        </div>
                    `;

                    // Bowling Stats
                    detailsHTML += `
                        <div class="details-section">
                            <h4>Bowling Statistics</h4>
                            <div class="stats-grid">
                                <div class="stat-item"><div class="stat-number">${stats.wickets || 0}</div><div class="stat-label">Wickets</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.bowlingAvg || '0.00'}</div><div class="stat-label">Bowling Average</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.economy || '0.00'}</div><div class="stat-label">Economy Rate</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.bestBowling || '-'}</div><div class="stat-label">Best Bowling</div></div>
                                <div class="stat-item"><div class="stat-number">${stats.fiveWickets || 0}</div><div class="stat-label">5-Wicket Hauls</div></div>
                            </div>
                        </div>
                    `;
                } else {
                    detailsHTML += '<div class="empty-state"><h4>No stats available for this player.</h4></div>';
                }

                detailsHTML += '</div>';
                if (elements.modalDetails) elements.modalDetails.innerHTML = detailsHTML;

                // Show modal and blur background
                if (elements.modal) elements.modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (elements.container) elements.container.classList.add('blurred');
                if (elements.header) elements.header.classList.add('blurred');
            } catch (error) {
                console.error('Error showing modal:', error);
            }
        };

    // Helper: ensure modal elements are present, try to re-query DOM or create minimal fallback
    function ensureModalElements() {
        try {
            if (!window.modalState) window.modalState = { initialized: false, elements: null };
            const elems = window.modalState.elements || {};
            // Re-query any missing elements
            elems.modal = elems.modal || document.getElementById('playerModal') || document.querySelector('.player-modal') || document.getElementById('player-modal');
            elems.modalName = elems.modalName || document.getElementById('modalPlayerName') || document.querySelector('.modal-player-name');
            elems.modalRole = elems.modalRole || document.getElementById('modalPlayerRole') || document.querySelector('.modal-player-role');
            elems.modalBadges = elems.modalBadges || document.getElementById('modalPlayerBadges') || document.querySelector('.modal-player-badges');
            elems.modalDetails = elems.modalDetails || document.getElementById('modalPlayerDetails') || document.querySelector('.modal-player-details') || document.querySelector('#modalPlayerDetails');
            elems.modalClose = elems.modalClose || document.getElementById('modalCloseButton') || document.querySelector('.modal-close');
            elems.container = elems.container || document.querySelector('.container');
            elems.header = elems.header || document.querySelector('.team-header');

            // If modal container is still missing, create a minimal modal in body so showPlayerModal can work
            if (!elems.modal) {
                const wrapper = document.createElement('div');
                wrapper.className = 'player-modal';
                wrapper.id = 'playerModal';
                wrapper.innerHTML = `<div class="player-modal-content">
                    <button class="modal-close" id="modalCloseButton">&times;</button>
                    <div class="modal-player-header">
                        <div class="modal-player-logo"><img id="modalPlayerLogo" src="assets/ipl_logo_new.svg"></div>
                        <h2 class="modal-player-name" id="modalPlayerName"></h2>
                        <p class="modal-player-role" id="modalPlayerRole"></p>
                        <div class="modal-player-badges" id="modalPlayerBadges"></div>
                    </div>
                    <div class="modal-player-details" id="modalPlayerDetails"></div>
                </div>`;
                document.body.appendChild(wrapper);
                elems.modal = wrapper;
                elems.modalName = elems.modalName || document.getElementById('modalPlayerName');
                elems.modalRole = elems.modalRole || document.getElementById('modalPlayerRole');
                elems.modalBadges = elems.modalBadges || document.getElementById('modalPlayerBadges');
                elems.modalDetails = elems.modalDetails || document.getElementById('modalPlayerDetails');
                elems.modalClose = elems.modalClose || document.getElementById('modalCloseButton');
            }

            window.modalState.elements = elems;
            window.modalState.initialized = true;

            // Attach close handler if available
            try {
                elems.modalClose?.addEventListener('click', window.closePlayerModal);
            } catch (e) {}

            return true;
        } catch (e) {
            console.error('ensureModalElements failed:', e);
            return false;
        }
    }

    // Define closePlayerModal globally
    window.closePlayerModal = function() {
        if (!window.modalState.initialized) {
            console.error('Modal not initialized');
            return;
        }

        const elements = window.modalState.elements;
        try {
            elements.modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            elements.container.classList.remove('blurred');
            elements.header.classList.remove('blurred');
        } catch (error) {
            console.error('Error closing modal:', error);
        }
    };

    // Add event listeners
    elements.modalClose.addEventListener('click', window.closePlayerModal);
    elements.modal.addEventListener('click', function(e) {
        if (e.target === elements.modal) {
            window.closePlayerModal();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            window.closePlayerModal();
        }
    });
}

// Initialize when DOM is loaded
// Always force modal initialization after page load
setTimeout(() => {
    try {
        initModal();
    } catch (e) {
        console.error('Modal force-init error:', e);
        let err = document.createElement('div');
        err.style = 'color:red;background:#fff;padding:1rem;text-align:center;position:fixed;top:0;left:0;right:0;z-index:99999;font-size:1.2rem;';
        err.innerText = 'Modal force-init error: ' + e;
        document.body.appendChild(err);
    }
}, 500);

// Debug: Add test button to open modal with sample data
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('testModalBtn');
    if (btn) {
        btn.onclick = function() {
            if (typeof window.showPlayerModal === 'function') {
                window.showPlayerModal({
                    name: 'Virat Kohli',
                    role: 'Batsman',
                    age: 37,
                    nationality: 'Indian',
                    isCaptain: true,
                    isForeign: false,
                    stats: {
                        matches: 237,
                        runs: 7263,
                        battingAvg: 37.25,
                        strikeRate: 130.02,
                        highestScore: 113,
                        centuries: 7,
                        fifties: 50,
                        wickets: 4,
                        bowlingAvg: 45.0,
                        economy: 8.5,
                        bestBowling: '2/25',
                        fiveWickets: 0
                    },
                    jersey: 18,
                    'batting style': 'Right-handed',
                    'bowling style': 'Right-arm medium'
                });
            } else {
                alert('Modal not initialized!');
            }
        };
    }
});