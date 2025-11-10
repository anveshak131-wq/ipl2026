/**
 * Server-Side Rendered Player Modal
 * Simple, reliable modal system that loads HTML from PHP/Python backend
 * No complex JavaScript - just load and display
 */

(function() {
    'use strict';

    const CONFIG = {
        MODAL_ID: 'playerModal',
        MODAL_CONTENT_ID: 'modalPlayerContent',
        ACTIVE_CLASS: 'active',
        // Try PHP first, fallback to Python
        PHP_ENDPOINT: 'api/player-modal.php',
        PYTHON_ENDPOINT: 'http://localhost:5001/api/player-modal',
        VERCEL_API_BASE: window.location.origin
    };

    let modal = null;
    let isInitialized = false;

    /**
     * Initialize modal
     */
    function init() {
        if (isInitialized) return;
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Get or create modal
        modal = document.getElementById(CONFIG.MODAL_ID);
        if (!modal) {
            modal = document.createElement('div');
            modal.id = CONFIG.MODAL_ID;
            modal.className = 'player-modal';
            modal.style.display = 'none';
            document.body.appendChild(modal);
        }
        
        // Ensure modal has the correct structure
        if (!modal.querySelector('.player-modal-backdrop') || !modal.querySelector('.player-modal-content')) {
            modal.innerHTML = `
                <div class="player-modal-backdrop"></div>
                <div class="player-modal-content">
                    <button class="modal-close" id="modalCloseBtn" aria-label="Close modal">&times;</button>
                    <div id="${CONFIG.MODAL_CONTENT_ID}">
                        <div class="empty-state">
                            <h4>Loading...</h4>
                            <p>Fetching player data...</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Ensure content div exists
        let contentDiv = document.getElementById(CONFIG.MODAL_CONTENT_ID);
        if (!contentDiv) {
            const content = modal.querySelector('.player-modal-content');
            if (content) {
                contentDiv = document.createElement('div');
                contentDiv.id = CONFIG.MODAL_CONTENT_ID;
                content.appendChild(contentDiv);
            }
        }

        // Setup close button
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.onclick = close;
        }

        // Close on backdrop click
        const backdrop = modal.querySelector('.player-modal-backdrop');
        if (backdrop) {
            backdrop.onclick = close;
        }

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.classList.contains(CONFIG.ACTIVE_CLASS)) {
                close();
            }
        });

        isInitialized = true;
        console.log('✅ Server-side modal initialized');
    }

    /**
     * Show modal with player data
     */
    async function show(playerName, teamCode) {
        if (!playerName || !teamCode) {
            console.error('Player name and team code required');
            return;
        }

        // Ensure initialized
        if (!isInitialized) {
            init();
            // Wait a bit for initialization
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!modal) {
            console.error('Modal not initialized');
            return;
        }

        const contentDiv = document.getElementById(CONFIG.MODAL_CONTENT_ID);
        if (!contentDiv) {
            console.error('Modal content div not found');
            return;
        }

        // Show loading state
        contentDiv.innerHTML = '<div class="empty-state"><h4>Loading...</h4><p>Fetching player data from server...</p></div>';
        modal.classList.add(CONFIG.ACTIVE_CLASS);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Try to load from server
        try {
            const html = await loadPlayerHTML(playerName, teamCode);
            if (html) {
                contentDiv.innerHTML = html;
            } else {
                contentDiv.innerHTML = '<div class="empty-state"><h4>Error</h4><p>Unable to load player data. Please try again later.</p></div>';
            }
        } catch (error) {
            console.error('Error loading player modal:', error);
            contentDiv.innerHTML = '<div class="empty-state"><h4>Error</h4><p>Failed to load player data: ' + error.message + '</p></div>';
        }
    }

    /**
     * Load player HTML from server (try PHP first, then Python)
     */
    async function loadPlayerHTML(playerName, teamCode) {
        const team = teamCode.toUpperCase();
        const player = encodeURIComponent(playerName);
        
        // Try PHP endpoint first
        try {
            const phpUrl = `${CONFIG.PHP_ENDPOINT}?team=${team}&player=${player}`;
            console.log('Trying PHP endpoint:', phpUrl);
            const response = await fetch(phpUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html'
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                if (html && !html.includes('Error') && !html.includes('Player Not Found')) {
                    console.log('✅ Loaded from PHP endpoint');
                    return html;
                }
            }
        } catch (error) {
            console.warn('PHP endpoint failed:', error);
        }

        // Try Python endpoint
        try {
            const pythonUrl = `${CONFIG.PYTHON_ENDPOINT}?team=${team}&player=${player}`;
            console.log('Trying Python endpoint:', pythonUrl);
            const response = await fetch(pythonUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html'
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                if (html && !html.includes('Error') && !html.includes('Player Not Found')) {
                    console.log('✅ Loaded from Python endpoint');
                    return html;
                }
            }
        } catch (error) {
            console.warn('Python endpoint failed:', error);
        }

        // Fallback: Try Vercel API and build HTML client-side (last resort)
        try {
            console.log('Trying Vercel API fallback...');
            const apiUrl = `${CONFIG.VERCEL_API_BASE}/api/admin/players?team=${team}`;
            const response = await fetch(apiUrl);
            
            if (response.ok) {
                const data = await response.json();
                const players = data.data || data || [];
                const player = players.find(p => 
                    p.name && p.name.toLowerCase().trim() === playerName.toLowerCase().trim()
                );
                
                if (player) {
                    return buildFallbackHTML(player, team);
                }
            }
        } catch (error) {
            console.error('Vercel API fallback failed:', error);
        }

        return null;
    }

    /**
     * Build HTML fallback (simple version)
     */
    function buildFallbackHTML(player, team) {
        const teamLogos = {
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

        const logo = teamLogos[team] || 'assets/ipl_logo_new.svg';
        const stats = player.stats || {};
        if (typeof stats === 'string') {
            try {
                stats = JSON.parse(stats);
            } catch {
                stats = {};
            }
        }

        let badges = [];
        if (player.isCaptain) badges.push('<span class="modal-badge">👑 Captain</span>');
        if (player.isViceCaptain) badges.push('<span class="modal-badge">⭐ Vice Captain</span>');
        if (player.isForeign) badges.push('<span class="modal-badge">🌏 Overseas</span>');
        if (!badges.length) badges.push('<span class="modal-badge">Player</span>');

        let html = `
            <div class="modal-player-header">
                <div class="modal-player-logo">
                    <img src="${logo}" alt="${player.name || 'Player'}">
                </div>
                <h2 class="modal-player-name">${player.name || 'Unknown Player'}</h2>
                <p class="modal-player-role">${player.role || 'Player'} • ${team}</p>
                <div class="modal-player-badges">${badges.join('')}</div>
            </div>
            <div class="modal-player-details">
                <div class="player-details-grid">
                    <div class="details-section">
                        <h4>Basic Information</h4>
                        ${player.age ? `<div class="detail-item"><div class="detail-label">Age</div><div class="detail-value">${player.age}</div></div>` : ''}
                        ${player.nationality ? `<div class="detail-item"><div class="detail-label">Nationality</div><div class="detail-value">${player.nationality}</div></div>` : ''}
                        ${player.jersey || player.number ? `<div class="detail-item"><div class="detail-label">Jersey</div><div class="detail-value">${player.jersey || player.number}</div></div>` : ''}
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Close modal
     */
    function close() {
        if (!modal) return;
        
        modal.classList.remove(CONFIG.ACTIVE_CLASS);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Public API
    window.PlayerModalServer = {
        show: show,
        close: close,
        init: init
    };

    // Legacy compatibility
    window.showPlayerModal = function(player) {
        if (player && player.name && player.team) {
            show(player.name, player.team);
        }
    };
    window.closePlayerModal = close;

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('Server-side player modal loaded');
})();

