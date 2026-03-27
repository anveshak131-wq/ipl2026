/**
 * Modern Player Modal System - Bulletproof Implementation
 * Creates modal dynamically if it doesn't exist
 * Handles all edge cases and timing issues
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        MODAL_ID: 'playerModal',
        MODAL_BACKDROP_CLASS: 'player-modal-backdrop',
        MODAL_CONTENT_CLASS: 'player-modal-content',
        MODAL_CLOSE_ID: 'modalCloseButton',
        MODAL_NAME_ID: 'modalPlayerName',
        MODAL_ROLE_ID: 'modalPlayerRole',
        MODAL_BADGES_ID: 'modalPlayerBadges',
        MODAL_DETAILS_ID: 'modalPlayerDetails',
        MODAL_LOGO_ID: 'modalPlayerLogo',
        ACTIVE_CLASS: 'active',
        // Use same API base as team-page-loader.js
        VERCEL_API_BASE: window.location.origin // Can be overridden: 'https://iplcrickethub-kappa.vercel.app'
    };

    // Team logos mapping
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

    // State management
    const state = {
        isInitialized: false,
        isOpen: false,
        currentPlayer: null,
        elements: {}
    };

    /**
     * Utility: Safe element query
     */
    function getElement(id) {
        if (!id) return null;
        try {
            const elem = document.getElementById(id);
            return elem && elem.nodeType === Node.ELEMENT_NODE ? elem : null;
        } catch (e) {
            console.error(`Error getting element ${id}:`, e);
            return null;
        }
    }

    /**
     * Utility: Safe innerHTML setter
     */
    function setHTML(element, html) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            console.warn('Cannot set HTML: invalid element');
            return false;
        }
        try {
            element.innerHTML = html;
            return true;
        } catch (e) {
            console.error('Error setting HTML:', e);
            return false;
        }
    }

    /**
     * Utility: Safe textContent setter
     */
    function setText(element, text) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        try {
            element.textContent = text || '';
            return true;
        } catch (e) {
            console.error('Error setting text:', e);
            return false;
        }
    }

    /**
     * Create modal HTML structure
     */
    function createModalHTML() {
        return `
            <div class="${CONFIG.MODAL_BACKDROP_CLASS}"></div>
            <div class="${CONFIG.MODAL_CONTENT_CLASS}">
                <button class="modal-close" id="${CONFIG.MODAL_CLOSE_ID}" aria-label="Close modal">&times;</button>
                <div class="modal-player-header">
                    <div class="modal-player-logo">
                        <img src="assets/ipl_logo_new.svg" alt="Player" id="${CONFIG.MODAL_LOGO_ID}">
                    </div>
                    <h2 class="modal-player-name" id="${CONFIG.MODAL_NAME_ID}">Player Name</h2>
                    <p class="modal-player-role" id="${CONFIG.MODAL_ROLE_ID}">Role</p>
                    <div class="modal-player-badges" id="${CONFIG.MODAL_BADGES_ID}"></div>
                </div>
                <div class="modal-player-details" id="${CONFIG.MODAL_DETAILS_ID}">
                    <div class="empty-state">
                        <h4>Loading...</h4>
                        <p>Fetching player data...</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Ensure modal exists in DOM
     */
    function ensureModalExists() {
        let modal = getElement(CONFIG.MODAL_ID);
        
        if (!modal) {
            console.log('Modal not found, creating it...');
            modal = document.createElement('div');
            modal.id = CONFIG.MODAL_ID;
            modal.className = 'player-modal';
            modal.setAttribute('style', 'display: none;');
            document.body.appendChild(modal);
        }
        
        // Always ensure modal has the required structure (rebuild if needed)
        const backdrop = modal.querySelector(`.${CONFIG.MODAL_BACKDROP_CLASS}`);
        const content = modal.querySelector(`.${CONFIG.MODAL_CONTENT_CLASS}`);
        const details = getElement(CONFIG.MODAL_DETAILS_ID);
        const name = getElement(CONFIG.MODAL_NAME_ID);
        const closeBtn = getElement(CONFIG.MODAL_CLOSE_ID);
        
        // Check if structure is complete - if any critical element is missing, rebuild
        if (!backdrop || !content || !details || !name || !closeBtn) {
            console.log('Modal structure incomplete or missing, building/rebuilding...');
            // Clear any existing content first
            modal.innerHTML = '';
            // Add the complete structure
            modal.innerHTML = createModalHTML();
            // Ensure it's hidden by default
            if (!modal.hasAttribute('style') || !modal.getAttribute('style').includes('display')) {
                modal.setAttribute('style', 'display: none;');
            }
            console.log('Modal structure built successfully');
        }
        
        return modal;
    }

    /**
     * Cache modal elements
     */
    function cacheElements() {
        const modal = ensureModalExists();
        
        state.elements = {
            modal: modal,
            backdrop: modal.querySelector(`.${CONFIG.MODAL_BACKDROP_CLASS}`),
            content: modal.querySelector(`.${CONFIG.MODAL_CONTENT_CLASS}`),
            closeBtn: getElement(CONFIG.MODAL_CLOSE_ID),
            name: getElement(CONFIG.MODAL_NAME_ID),
            role: getElement(CONFIG.MODAL_ROLE_ID),
            badges: getElement(CONFIG.MODAL_BADGES_ID),
            details: getElement(CONFIG.MODAL_DETAILS_ID),
            logo: getElement(CONFIG.MODAL_LOGO_ID)
        };
        
        // Verify critical elements
        const critical = ['modal', 'details', 'name', 'closeBtn'];
        const missing = critical.filter(key => !state.elements[key]);
        
        if (missing.length > 0) {
            console.error('Critical modal elements missing:', missing);
            return false;
        }
        
        return true;
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        if (!state.elements.modal || !state.elements.closeBtn) {
            console.error('Cannot setup event listeners: modal elements missing');
            return;
        }

        // Close button
        const closeBtn = state.elements.closeBtn;
        closeBtn.removeEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);

        // Backdrop click
        const backdrop = state.elements.backdrop;
        if (backdrop) {
            backdrop.removeEventListener('click', handleBackdropClick);
            backdrop.addEventListener('click', handleBackdropClick);
        }

        // Modal container click (but not content)
        state.elements.modal.removeEventListener('click', handleModalClick);
        state.elements.modal.addEventListener('click', handleModalClick);

        // ESC key
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Event handlers
     */
    function handleBackdropClick(e) {
        if (e.target === state.elements.backdrop) {
            closeModal();
        }
    }

    function handleModalClick(e) {
        if (e.target === state.elements.modal && e.target !== state.elements.content) {
            closeModal();
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Escape' && state.isOpen) {
            closeModal();
        }
    }

    /**
     * Initialize modal system
     */
    function initialize() {
        if (state.isInitialized) {
            console.log('Modal already initialized');
            return true;
        }

        console.log('Initializing player modal system...');

        // Wait for DOM if needed
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initialize, 100);
            });
            return false;
        }

        // Cache elements
        if (!cacheElements()) {
            console.error('Failed to cache modal elements');
            // Retry after delay
            setTimeout(() => {
                if (cacheElements()) {
                    setupEventListeners();
                    state.isInitialized = true;
                    console.log('Modal initialized successfully (retry)');
                }
            }, 500);
            return false;
        }

        // Setup event listeners
        setupEventListeners();

        state.isInitialized = true;
        console.log('✅ Player modal system initialized successfully');
        return true;
    }

    /**
     * Fetch player stats from API
     */
    async function fetchPlayerStats(playerName, teamCode) {
        try {
            const teamCodeUpper = teamCode ? teamCode.toUpperCase() : '';
            const apiUrl = `${CONFIG.VERCEL_API_BASE}/api/admin/players?team=${teamCodeUpper}`;
            
            console.log(`🔄 Fetching stats for ${playerName} (${teamCodeUpper})...`);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                console.warn(`⚠️ API response: ${response.status}`);
                return null;
            }
            
            const result = await response.json();
            const playersData = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
            
            const playerData = playersData.find(p => 
                p.name && p.name.toLowerCase().trim() === playerName.toLowerCase().trim()
            );
            
            if (!playerData) {
                console.warn(`⚠️ Player ${playerName} not found in API`);
                return null;
            }
            
            // Parse stats
            let stats = playerData.stats || {};
            if (typeof stats === 'string') {
                try {
                    stats = JSON.parse(stats);
                } catch (e) {
                    console.warn('Failed to parse stats JSON');
                    stats = {};
                }
            }
            
            console.log(`✅ Found stats for ${playerName}`);
            return { ...playerData, stats };
            
        } catch (error) {
            console.error('❌ Error fetching player stats:', error);
            return null;
        }
    }

    /**
     * Build player details HTML
     */
    function buildPlayerDetailsHTML(player) {
        const stats = player.stats || {};
        const battingStyle = player['batting style'] || player.battingStyle || '';
        const bowlingStyle = player['bowling style'] || player.bowlingStyle || '';
        const allrounderType = player['allrounder type'] || player.allrounderType || '';
        
        let html = '<div class="player-details-grid">';
        
        // Basic Information
        html += '<div class="details-section"><h4>Basic Information</h4>';
        if (player.age) html += `<div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${player.age}</div></div>`;
        if (player.nationality) html += `<div class="detail-item"><div class="detail-label">Nationality</div><div class="detail-value">${player.nationality}</div></div>`;
        if (player.jersey || player.number) html += `<div class="detail-item"><div class="detail-label">Jersey</div><div class="detail-value">${player.jersey || player.number}</div></div>`;
        if (battingStyle) html += `<div class="detail-item"><div class="detail-label">Batting</div><div class="detail-value">${battingStyle}</div></div>`;
        if (bowlingStyle) html += `<div class="detail-item"><div class="detail-label">Bowling</div><div class="detail-value">${bowlingStyle}</div></div>`;
        if (allrounderType) html += `<div class="detail-item"><div class="detail-label">Type</div><div class="detail-value">${allrounderType}</div></div>`;
        html += '</div>';
        
        // Batting Statistics
        const hasBattingStats = stats.matches || stats.runs || stats.innings;
        if (hasBattingStats) {
            html += '<div class="details-section"><h4>Batting Statistics</h4><div class="stats-grid">';
            html += `<div class="stat-item"><div class="stat-number">${stats.matches || 0}</div><div class="stat-label">Matches</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.innings || 0}</div><div class="stat-label">Innings</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.runs || 0}</div><div class="stat-label">Runs</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.battingAvg || 0}</div><div class="stat-label">Average</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.strikeRate || 0}</div><div class="stat-label">Strike Rate</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.highestScore || 0}</div><div class="stat-label">Highest</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.centuries || 0}</div><div class="stat-label">100s</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.fifties || 0}</div><div class="stat-label">50s</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.sixes || 0}</div><div class="stat-label">Sixes</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.fours || 0}</div><div class="stat-label">Fours</div></div>`;
            html += '</div></div>';
        }
        
        // Bowling Statistics
        const hasBowlingStats = stats.wickets || stats.bowlingAvg || stats.economy;
        if (hasBowlingStats) {
            html += '<div class="details-section"><h4>Bowling Statistics</h4><div class="stats-grid">';
            html += `<div class="stat-item"><div class="stat-number">${stats.wickets || 0}</div><div class="stat-label">Wickets</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.bowlingAvg || 0}</div><div class="stat-label">Average</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.economy || 0}</div><div class="stat-label">Economy</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.bestBowling || '-'}</div><div class="stat-label">Best</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.fiveWickets || 0}</div><div class="stat-label">5-Wickets</div></div>`;
            html += `<div class="stat-item"><div class="stat-number">${stats.fourWickets || 0}</div><div class="stat-label">4-Wickets</div></div>`;
            html += '</div></div>';
        }
        
        if (!hasBattingStats && !hasBowlingStats) {
            html += '<div class="details-section"><div class="empty-state"><h4>No statistics available</h4><p>Stats will be displayed once added to the system.</p></div></div>';
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Build badges HTML
     */
    function buildBadgesHTML(player) {
        const badges = [];
        if (player.isCaptain) badges.push('<span class="modal-badge">👑 Captain</span>');
        if (player.isViceCaptain) badges.push('<span class="modal-badge">⭐ Vice Captain</span>');
        if (player.isForeign) badges.push('<span class="modal-badge">🌏 Overseas</span>');
        const role = (player.role || '').toLowerCase();
        if (role.includes('wicket')) badges.push('<span class="modal-badge">🧤 Wicket-Keeper</span>');
        return badges.length > 0 ? badges.join('') : '<span class="modal-badge">Player</span>';
    }

    /**
     * Show player modal
     */
    async function showModal(player) {
        if (!player || !player.name) {
            console.error('Invalid player data');
            return;
        }

        console.log('Opening modal for:', player.name);

        // Ensure initialization
        if (!state.isInitialized) {
            if (!initialize()) {
                console.error('Failed to initialize modal');
                alert('Modal system is not ready. Please refresh the page.');
                return;
            }
        }

        // Refresh element cache
        if (!cacheElements()) {
            console.error('Failed to cache elements');
            return;
        }

        // Store current player
        state.currentPlayer = player;

        // Set basic info immediately
        const elements = state.elements;
        setText(elements.name, player.name || 'Unknown Player');
        
        const roleText = player.role || 'Player';
        const teamText = player.team || '';
        setText(elements.role, teamText ? `${roleText} • ${teamText}` : roleText);

        // Set logo
        if (elements.logo && player.team) {
            const logoPath = TEAM_LOGOS[player.team] || 'assets/ipl_logo_new.svg';
            elements.logo.src = logoPath;
            elements.logo.alt = player.team;
            elements.logo.onerror = function() {
                this.src = 'assets/ipl_logo_new.svg';
            };
        }

        // Set badges
        setHTML(elements.badges, buildBadgesHTML(player));

        // Show loading state
        setHTML(elements.details, '<div class="empty-state"><h4>Loading statistics...</h4><p>Fetching player data...</p></div>');

        // Show modal
        elements.modal.classList.add(CONFIG.ACTIVE_CLASS);
        document.body.style.overflow = 'hidden';
        state.isOpen = true;

        // Blur background elements
        const container = document.querySelector('.container');
        const header = document.querySelector('.team-header');
        if (container) container.classList.add('blurred');
        if (header) header.classList.add('blurred');

        // Fetch detailed stats
        try {
            const detailedData = await fetchPlayerStats(player.name, player.team);
            const finalPlayer = detailedData || player;

            // Update with detailed data
            const finalRoleText = finalPlayer.role || player.role || 'Player';
            const finalTeamText = finalPlayer.team || player.team || '';
            setText(elements.role, finalTeamText ? `${finalRoleText} • ${finalTeamText}` : finalRoleText);

            // Merge player data
            const mergedPlayer = {
                ...player,
                ...finalPlayer,
                stats: finalPlayer.stats || player.stats || {}
            };

            setHTML(elements.badges, buildBadgesHTML(mergedPlayer));
            setHTML(elements.details, buildPlayerDetailsHTML(mergedPlayer));

        } catch (error) {
            console.error('Error loading player details:', error);
            setHTML(elements.details, '<div class="empty-state"><h4>Error loading statistics</h4><p>Unable to fetch player data. Please try again later.</p></div>');
        }
    }

    /**
     * Close player modal
     */
    function closeModal() {
        if (!state.isOpen) return;

        console.log('Closing modal');

        // Refresh element cache
        cacheElements();

        const elements = state.elements;
        if (elements.modal) {
            elements.modal.classList.remove(CONFIG.ACTIVE_CLASS);
        }

        document.body.style.overflow = 'auto';
        state.isOpen = false;
        state.currentPlayer = null;

        // Remove blur
        const container = document.querySelector('.container');
        const header = document.querySelector('.team-header');
        if (container) container.classList.remove('blurred');
        if (header) header.classList.remove('blurred');
    }

    // Public API
    window.PlayerModal = {
        show: showModal,
        close: closeModal,
        init: initialize,
        isInitialized: () => state.isInitialized,
        isOpen: () => state.isOpen
    };

    // Legacy API for compatibility
    window.showPlayerModal = showModal;
    window.closePlayerModal = closeModal;
    window.initModal = initialize;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initialize, 100);
        });
    } else {
        setTimeout(initialize, 100);
    }

    // Also try after a delay to handle async script loading
    setTimeout(initialize, 500);
    setTimeout(initialize, 1000);

    console.log('Player modal system loaded');
})();

