/**
 * UIRenderer - Dynamic DOM rendering for IPL Teams Manager
 * Handles rendering of teams grid, team cards, and admin interface
 */

class UIRenderer {
    constructor(dataManager) {
        this.dm = dataManager;
    }

    /**
     * Render all teams in a grid container
     * @param {HTMLElement} container - Container element to render into
     */
    renderTeamsGrid(container) {
        const teams = this.dm.getAllTeams();
        container.innerHTML = '';

        teams.forEach((team, index) => {
            const card = this.createTeamCard(team, index);
            container.appendChild(card);
        });
    }

    /**
     * Create a team card element
     * @param {Object} team - Team object
     * @param {number} delay - Animation delay
     * @returns {HTMLElement} Team card element
     */
    createTeamCard(team, delay = 0) {
        const card = document.createElement('a');
        card.className = 'team-card';
        card.href = `team.html?code=${team.code}`;
        card.setAttribute('data-team', team.code);
        card.style.animationDelay = `${delay * 0.05}s`;

        // Get player count
        const playerCount = this.dm.getTeamPlayers(team.code).length;

        card.innerHTML = `
            <div class="team-card-header" style="background: linear-gradient(135deg, ${team.color} 0%, ${team.darkColor} 100%);">
                <div class="team-badge">${this._getTeamEmoji(team.code)}</div>
            </div>
            <div class="team-card-body">
                <div class="team-name">${team.name}</div>
                <div class="team-code">${team.code}</div>
                <div class="team-info">
                    <div class="team-stat">
                        <span class="team-stat-label">City</span>
                        <span class="team-stat-value">${team.city}</span>
                    </div>
                    <div class="team-stat">
                        <span class="team-stat-label">Founded</span>
                        <span class="team-stat-value">${team.founded}</span>
                    </div>
                    <div class="team-stat">
                        <span class="team-stat-label">Players</span>
                        <span class="team-stat-value">${playerCount}</span>
                    </div>
                </div>
            </div>
            <div class="team-card-footer">
                <button class="btn btn-primary btn-sm">View Squad</button>
            </div>
        `;

        return card;
    }

    /**
     * Render admin modal with tabs
     * @returns {HTMLElement} Modal element
     */
    createAdminModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'adminModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Dev Admin Panel</h2>
                    <button class="modal-close">✕</button>
                </div>
                <div class="modal-body">
                    <!-- Password Authentication -->
                    <div id="authForm" style="margin-bottom: var(--space-lg);">
                        <h3 style="margin-bottom: var(--space-md);">Authentication Required</h3>
                        <form onsubmit="return false;" style="display: flex; gap: var(--space-md);">
                            <input type="password" id="adminPassword" placeholder="Enter admin password" style="flex: 1;">
                            <button type="button" class="btn btn-primary btn-sm" id="authBtn">Login</button>
                        </form>
                        <p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm); margin-top: var(--space-sm);">
                            Hint: Think about the year... 🔐
                        </p>
                    </div>

                    <!-- Admin Panel (Hidden until authenticated) -->
                    <div id="adminPanel" style="display: none;">
                        <!-- Tabs -->
                        <div class="modal-tabs">
                            <button class="modal-tab active" data-tab="teams">Teams</button>
                            <button class="modal-tab" data-tab="players">Players</button>
                            <button class="modal-tab" data-tab="export">Export/Debug</button>
                        </div>

                        <!-- Teams Tab -->
                        <div class="modal-tab-content active" data-tab="teams">
                            <h3>Team Statistics</h3>
                            <div id="teamStats" style="margin-bottom: var(--space-lg);"></div>
                        </div>

                        <!-- Players Tab -->
                        <div class="modal-tab-content" data-tab="players">
                            <h3>Add Player</h3>
                            <form id="playerForm" style="margin-bottom: var(--space-lg);">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="playerTeam">Team</label>
                                        <select id="playerTeam" required>
                                            <option value="">Select Team</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="playerName">Name</label>
                                        <input type="text" id="playerName" placeholder="Player name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="playerRole">Role</label>
                                        <select id="playerRole" required>
                                            <option value="">Select Role</option>
                                            <option value="Batsman">Batsman</option>
                                            <option value="Bowler">Bowler</option>
                                            <option value="All-rounder">All-rounder</option>
                                            <option value="Wicket Keeper">Wicket Keeper</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="playerCountry">Country</label>
                                        <input type="text" id="playerCountry" placeholder="Player country">
                                    </div>
                                    <div class="form-group">
                                        <label for="playerJersey">Jersey Number</label>
                                        <input type="number" id="playerJersey" placeholder="Jersey number" min="1" max="99">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success btn-block">Add Player</button>
                            </form>

                            <h3>Current Squad</h3>
                            <div id="squadList" style="max-height: 300px; overflow-y: auto;"></div>
                        </div>

                        <!-- Export/Debug Tab -->
                        <div class="modal-tab-content" data-tab="export">
                            <h3>Export Data</h3>
                            <button type="button" class="btn btn-primary" id="exportXmlBtn">📄 Export XML</button>
                            <button type="button" class="btn btn-primary" id="exportJsonBtn" style="margin-left: var(--space-md);">📊 Export JSON</button>
                            
                            <h3 style="margin-top: var(--space-xl); margin-bottom: var(--space-md);">Debug</h3>
                            <div id="debugInfo" style="background: var(--color-bg-tertiary); padding: var(--space-lg); border-radius: var(--radius-md); font-family: var(--font-family-mono); font-size: var(--font-size-sm); overflow-x: auto; margin-bottom: var(--space-lg);"></div>
                            
                            <button type="button" class="btn btn-error btn-block" id="clearDataBtn">🗑️ Clear All Data</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return modal;
    }

    /**
     * Render team statistics in admin panel
     * @param {HTMLElement} container - Container element
     */
    renderTeamStats(container) {
        const stats = this.dm.getStatistics();
        container.innerHTML = '';

        // Summary cards
        const summary = document.createElement('div');
        summary.style.display = 'grid';
        summary.style.gridTemplateColumns = 'repeat(auto-fit, minmax(150px, 1fr))';
        summary.style.gap = 'var(--space-md)';
        summary.style.marginBottom = 'var(--space-lg)';

        const totalTeamsCard = document.createElement('div');
        totalTeamsCard.className = 'card';
        totalTeamsCard.innerHTML = `
            <h4 style="margin: 0 0 var(--space-sm) 0;">Total Teams</h4>
            <p style="font-size: 2rem; font-weight: 700; margin: 0; color: var(--color-secondary);">${stats.totalTeams}</p>
        `;
        summary.appendChild(totalTeamsCard);

        const totalPlayersCard = document.createElement('div');
        totalPlayersCard.className = 'card';
        totalPlayersCard.innerHTML = `
            <h4 style="margin: 0 0 var(--space-sm) 0;">Total Players</h4>
            <p style="font-size: 2rem; font-weight: 700; margin: 0; color: var(--color-success);">${stats.totalPlayers}</p>
        `;
        summary.appendChild(totalPlayersCard);

        const avgPlayersCard = document.createElement('div');
        avgPlayersCard.className = 'card';
        avgPlayersCard.innerHTML = `
            <h4 style="margin: 0 0 var(--space-sm) 0;">Avg per Team</h4>
            <p style="font-size: 2rem; font-weight: 700; margin: 0; color: var(--color-info);">${stats.averagePlayersPerTeam}</p>
        `;
        summary.appendChild(avgPlayersCard);

        container.appendChild(summary);

        // Detailed table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr style="border-bottom: 2px solid var(--color-border-light);">
                    <th style="text-align: left; padding: var(--space-sm);">Team</th>
                    <th style="text-align: right; padding: var(--space-sm);">Players</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.getElementsByTagName('tbody')[0];
        stats.teams.forEach(teamStat => {
            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--color-border-light)';
            row.innerHTML = `
                <td style="padding: var(--space-sm);">${teamStat.name}</td>
                <td style="text-align: right; padding: var(--space-sm); font-weight: 600;">${teamStat.playerCount}</td>
            `;
            tbody.appendChild(row);
        });

        container.appendChild(table);
    }

    /**
     * Populate team select dropdown
     * @param {HTMLElement} selectElement - Select element
     */
    populateTeamSelect(selectElement) {
        const teams = this.dm.getAllTeams();
        selectElement.innerHTML = '<option value="">Select Team</option>';

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.code;
            option.textContent = team.name;
            selectElement.appendChild(option);
        });
    }

    /**
     * Render squad list for players tab
     * @param {HTMLElement} container - Container element
     */
    renderSquadList(container) {
        const teams = this.dm.getAllTeams();
        container.innerHTML = '';

        teams.forEach(team => {
            const players = this.dm.getTeamPlayers(team.code);

            const teamSection = document.createElement('div');
            teamSection.style.marginBottom = 'var(--space-lg)';
            teamSection.style.padding = 'var(--space-md)';
            teamSection.style.background = 'var(--color-bg-tertiary)';
            teamSection.style.borderRadius = 'var(--radius-md)';

            teamSection.innerHTML = `
                <h5 style="margin: 0 0 var(--space-sm) 0; color: var(--color-text-primary);">${team.name}</h5>
            `;

            if (players.length === 0) {
                teamSection.innerHTML += `
                    <p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-tertiary);">No players yet</p>
                `;
            } else {
                const playerList = document.createElement('ul');
                playerList.style.margin = '0';
                playerList.style.paddingLeft = 'var(--space-lg)';

                players.forEach(player => {
                    const li = document.createElement('li');
                    li.style.fontSize = 'var(--font-size-sm)';
                    li.style.marginBottom = 'var(--space-xs)';
                    li.innerHTML = `
                        <strong>${player.name}</strong> - ${player.role}
                        <span style="color: var(--color-text-tertiary);">(${player.country || 'N/A'}, #${player.jersey || 'N/A'})</span>
                    `;
                    playerList.appendChild(li);
                });

                teamSection.appendChild(playerList);
            }

            container.appendChild(teamSection);
        });
    }

    /**
     * Render debug information
     * @param {HTMLElement} container - Container element
     */
    renderDebugInfo(container) {
        const stats = this.dm.getStatistics();
        const info = `Teams: ${stats.totalTeams}
Players: ${stats.totalPlayers}
Last Updated: ${new Date().toISOString()}

Data Source: In-Memory XML
Storage: DOMParser/XMLSerializer
Persistence: None (page refresh = data lost)`;

        container.textContent = info;
    }

    /**
     * Get team emoji based on team code
     * @private
     */
    _getTeamEmoji(code) {
        const emojis = {
            'MI': '🦁',
            'CSK': '🦁',
            'RCB': '🔴',
            'KKR': '🦅',
            'DC': '🦁',
            'SRH': '🌅',
            'RR': '🦂',
            'PBKS': '⚔️',
            'GT': '🐯',
            'LSG': '🦁'
        };
        return emojis[code] || '🏏';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIRenderer;
}
