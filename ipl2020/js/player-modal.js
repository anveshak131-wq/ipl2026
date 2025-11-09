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
        document.body.appendChild(err);
        return;
    }

    console.log('All modal elements found');
    
    // Store elements globally
    window.modalState.elements = elements;
    window.modalState.initialized = true;

    // Define showPlayerModal globally
    window.showPlayerModal = function(player) {
        if (!window.modalState.initialized) {
            console.error('Modal not initialized');
            return;
        }

        console.log('Showing modal for player:', player);
        const elements = window.modalState.elements;

        try {
            // Set basic info
            elements.modalName.textContent = player.name || 'Unknown Player';
            elements.modalRole.textContent = player.role || 'Player';

            // Set badges
            let badgesHTML = '';
            if (player.isCaptain) badgesHTML += '<span class="modal-badge badge-captain">👑 Captain</span>';
            if (player.isViceCaptain) badgesHTML += '<span class="modal-badge badge-captain">⭐ Vice Captain</span>';
            if (player.isForeign) badgesHTML += '<span class="modal-badge badge-foreign">🌏 Overseas</span>';
            if ((player.role || '').toLowerCase() === 'wicket-keeper') badgesHTML += '<span class="modal-badge badge-wk">🧤 Wicket-Keeper</span>';
            elements.modalBadges.innerHTML = badgesHTML;

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
            elements.modalDetails.innerHTML = detailsHTML;

            // Show modal and blur background
            elements.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            elements.container.classList.add('blurred');
            elements.header.classList.add('blurred');
        } catch (error) {
            console.error('Error showing modal:', error);
        }
    };

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