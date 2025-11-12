/**
 * App - Main initialization and event handlers for IPL Teams Manager
 * Coordinates DataManager and UIRenderer for the application
 */

class App {
    constructor() {
        this.dm = null;
        this.ui = null;
        this.adminAuthenticated = false;
        this.adminPassword = 'admin2025'; // Default password (year 2024 + 1)
    }

    /**
     * Initialize the application
     */
    initialize() {
        try {
            // Create or get shared DataManager instance
            if (!window.sharedDataManager) {
                window.sharedDataManager = new DataManager();
            }
            this.dm = window.sharedDataManager;
            this.ui = new UIRenderer(this.dm);

            // Setup event listeners
            this._setupEventListeners();

            // Render initial UI
            this._renderHomepage();

            console.log('IPL Teams Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this._showErrorMessage('Failed to initialize application');
        }
    }

    /**
     * Setup event listeners for admin modal and forms
     * @private
     */
    _setupEventListeners() {
        // Admin modal open/close
        const adminLink = document.getElementById('adminLink');
        const modal = document.getElementById('adminModal');
        const closeBtn = modal?.querySelector('.modal-close');

        if (adminLink && modal) {
            adminLink.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
                this.adminAuthenticated = false;
                this._resetAdminPanel();
            });
        }

        // Close modal on outside click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    this.adminAuthenticated = false;
                    this._resetAdminPanel();
                }
            });
        }

        // Admin authentication
        const authBtn = document.getElementById('authBtn');
        const passwordInput = document.getElementById('adminPassword');

        if (authBtn) {
            authBtn.addEventListener('click', () => this._authenticateAdmin(passwordInput.value));
            if (passwordInput) {
                passwordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this._authenticateAdmin(passwordInput.value);
                    }
                });
            }
        }

        // Tab switching
        const tabs = document.querySelectorAll('.modal-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this._switchTab(tab.getAttribute('data-tab')));
        });

        // Player form
        const playerForm = document.getElementById('playerForm');
        if (playerForm) {
            playerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this._handleAddPlayer();
            });
        }

        // Export/Debug buttons
        const exportXmlBtn = document.getElementById('exportXmlBtn');
        if (exportXmlBtn) {
            exportXmlBtn.addEventListener('click', () => this._exportXML());
        }

        const exportJsonBtn = document.getElementById('exportJsonBtn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this._exportJSON());
        }

        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => this._clearAllData());
        }
    }

    /**
     * Authenticate admin user
     * @private
     */
    _authenticateAdmin(password) {
        if (password === this.adminPassword) {
            this.adminAuthenticated = true;
            document.getElementById('authForm').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';

            // Initialize admin panel content
            this._initializeAdminPanel();

            // Show success message
            this._showSuccessMessage('Admin authenticated!');
        } else {
            this._showErrorMessage('Invalid password');
            document.getElementById('adminPassword').value = '';
        }
    }

    /**
     * Initialize admin panel content
     * @private
     */
    _initializeAdminPanel() {
        // Render team stats
        const teamStats = document.getElementById('teamStats');
        if (teamStats) {
            this.ui.renderTeamStats(teamStats);
        }

        // Populate team select
        const playerTeam = document.getElementById('playerTeam');
        if (playerTeam) {
            this.ui.populateTeamSelect(playerTeam);
        }

        // Render squad list
        const squadList = document.getElementById('squadList');
        if (squadList) {
            this.ui.renderSquadList(squadList);
        }

        // Render debug info
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            this.ui.renderDebugInfo(debugInfo);
        }
    }

    /**
     * Switch between tabs in admin panel
     * @private
     */
    _switchTab(tabName) {
        // Deactivate all tabs and contents
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.modal-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Activate selected tab
        document.querySelector(`[data-tab="${tabName}"].modal-tab`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"].modal-tab-content`).classList.add('active');

        // Refresh content based on tab
        if (tabName === 'teams') {
            const teamStats = document.getElementById('teamStats');
            if (teamStats) this.ui.renderTeamStats(teamStats);
        } else if (tabName === 'players') {
            const squadList = document.getElementById('squadList');
            if (squadList) this.ui.renderSquadList(squadList);
        } else if (tabName === 'export') {
            const debugInfo = document.getElementById('debugInfo');
            if (debugInfo) this.ui.renderDebugInfo(debugInfo);
        }
    }

    /**
     * Handle adding a player
     * @private
     */
    _handleAddPlayer() {
        const teamCode = document.getElementById('playerTeam').value;
        const name = document.getElementById('playerName').value.trim();
        const role = document.getElementById('playerRole').value;
        const country = document.getElementById('playerCountry').value.trim();
        const jersey = document.getElementById('playerJersey').value;

        // Validate
        if (!teamCode || !name || !role) {
            this._showErrorMessage('Please fill in all required fields');
            return;
        }

        // Add player
        const result = this.dm.addPlayer(teamCode, { name, role, country, jersey });

        if (result) {
            this._showSuccessMessage(`Added ${name} to ${this.dm.getTeam(teamCode).name}`);

            // Reset form
            document.getElementById('playerForm').reset();

            // Refresh squad list and stats
            const squadList = document.getElementById('squadList');
            if (squadList) this.ui.renderSquadList(squadList);

            const teamStats = document.getElementById('teamStats');
            if (teamStats) this.ui.renderTeamStats(teamStats);

            // Refresh homepage if it exists
            this._renderHomepage();
        } else {
            this._showErrorMessage('Failed to add player');
        }
    }

    /**
     * Export data as XML
     * @private
     */
    _exportXML() {
        const xml = this.dm.exportXML();
        this._downloadFile(xml, 'ipl-teams-data.xml', 'application/xml');
        this._showSuccessMessage('XML exported successfully');
    }

    /**
     * Export data as JSON
     * @private
     */
    _exportJSON() {
        const json = this.dm.exportJSON();
        const jsonString = JSON.stringify(json, null, 2);
        this._downloadFile(jsonString, 'ipl-teams-data.json', 'application/json');
        this._showSuccessMessage('JSON exported successfully');
    }

    /**
     * Clear all data with confirmation
     * @private
     */
    _clearAllData() {
        if (confirm('Are you sure you want to clear ALL player data? This cannot be undone.')) {
            this.dm.clearAllData();
            this._showSuccessMessage('All data cleared');

            // Refresh admin panel
            this._initializeAdminPanel();

            // Refresh homepage
            this._renderHomepage();
        }
    }

    /**
     * Render homepage content
     * @private
     */
    _renderHomepage() {
        const teamsGrid = document.getElementById('teamsGrid');
        if (teamsGrid) {
            this.ui.renderTeamsGrid(teamsGrid);
        }
    }

    /**
     * Reset admin panel
     * @private
     */
    _resetAdminPanel() {
        document.getElementById('authForm').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('adminPassword').value = '';
    }

    /**
     * Download file utility
     * @private
     */
    _downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * Show success message
     * @private
     */
    _showSuccessMessage(message) {
        this._showNotification(message, 'success');
    }

    /**
     * Show error message
     * @private
     */
    _showErrorMessage(message) {
        this._showNotification(message, 'error');
    }

    /**
     * Show notification
     * @private
     */
    _showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 20px;
            background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-info)'};
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 2000;
            animation: slideInRight 300ms ease-out;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 300ms ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.initialize();

    // Make app globally accessible for debugging
    window.iplApp = app;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
