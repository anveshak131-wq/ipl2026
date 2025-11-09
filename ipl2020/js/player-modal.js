// Global modal state and elements
window.modalState = {
    initialized: false,
    elements: null
};

// Initialize modal functionality
function initModal() {
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

    // Check if all elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('Missing modal elements:', missingElements);
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModal);
} else {
    initModal();
}