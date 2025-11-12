/**
 * App.js - Application Initialization
 * 
 * Minimal app module for future expansion.
 * Current functionality handled by inline scripts in HTML pages.
 */

const App = {
    version: '1.0.0',
    name: 'IPL Teams Manager',

    /**
     * Initialize the application
     */
    init() {
        console.log(`${this.name} v${this.version} initialized`);
        this.setupEventListeners();
    },

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Add any global event listeners here
        document.addEventListener('DOMContentLoaded', () => {
            this.onPageReady();
        });
    },

    /**
     * Handle page ready event
     */
    onPageReady() {
        // Remove loading indicators if any
        const loaders = document.querySelectorAll('[data-loading]');
        loaders.forEach(loader => {
            loader.style.display = 'none';
        });
    },

    /**
     * Utility: Format player info for display
     */
    formatPlayer(player) {
        return `${player.name} (${player.role})`;
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
