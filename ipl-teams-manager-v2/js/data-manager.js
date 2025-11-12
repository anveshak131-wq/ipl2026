/**
 * DataManager - In-Memory XML Data Store for IPL Teams Manager
 * Handles CRUD operations for teams and players using DOMParser/XMLSerializer
 * Data is stored in memory only - no persistence across page reloads
 */

class DataManager {
    constructor() {
        this.xmlDoc = null;
        this.initializeData();
    }

    /**
     * Initialize in-memory XML data with all 10 IPL teams
     */
    initializeData() {
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ipl>
    <teams>
        <team>
            <code>MI</code>
            <name>Mumbai Indians</name>
            <color>#004B87</color>
            <darkColor>#003056</darkColor>
            <city>Mumbai</city>
            <stadium>Wankhede Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>CSK</code>
            <name>Chennai Super Kings</name>
            <color>#FFC72C</color>
            <darkColor>#FFA500</darkColor>
            <city>Chennai</city>
            <stadium>M. A. Chidambaram Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>RCB</code>
            <name>Royal Challengers Bangalore</name>
            <color>#EC1C24</color>
            <darkColor>#C41E3A</darkColor>
            <city>Bangalore</city>
            <stadium>M. Chinnaswamy Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>KKR</code>
            <name>Kolkata Knight Riders</name>
            <color>#3A225E</color>
            <darkColor>#281847</darkColor>
            <city>Kolkata</city>
            <stadium>Eden Gardens</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>DC</code>
            <name>Delhi Capitals</name>
            <color>#004B5E</color>
            <darkColor>#002F3E</darkColor>
            <city>Delhi</city>
            <stadium>Arun Jaitley Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>SRH</code>
            <name>Sunrisers Hyderabad</name>
            <color>#FF6D1F</color>
            <darkColor>#E04E0D</darkColor>
            <city>Hyderabad</city>
            <stadium>Rajiv Gandhi International Stadium</stadium>
            <founded>2013</founded>
            <players></players>
        </team>
        <team>
            <code>RR</code>
            <name>Rajasthan Royals</name>
            <color>#E91E63</color>
            <darkColor>#C2185B</darkColor>
            <city>Jaipur</city>
            <stadium>Sawai Mansingh Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>PBKS</code>
            <name>Punjab Kings</name>
            <color>#EE2C2C</color>
            <darkColor>#C41E3A</darkColor>
            <city>Mohali</city>
            <stadium>PCA Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>GT</code>
            <name>Gujarat Titans</name>
            <color>#1E90FF</color>
            <darkColor>#1161BF</darkColor>
            <city>Ahmedabad</city>
            <stadium>Narendra Modi Stadium</stadium>
            <founded>2022</founded>
            <players></players>
        </team>
        <team>
            <code>LSG</code>
            <name>Lucknow Super Giants</name>
            <color>#5B8F5B</color>
            <darkColor>#3D5C3D</darkColor>
            <city>Lucknow</city>
            <stadium>ARUN JAITLEY STADIUM</stadium>
            <founded>2022</founded>
            <players></players>
        </team>
    </teams>
</ipl>`;

        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        if (this.xmlDoc.getElementsByTagName('parsererror').length > 0) {
            console.error('XML parsing error:', this.xmlDoc.getElementsByTagName('parsererror')[0].textContent);
            throw new Error('Failed to initialize data');
        }
    }

    /**
     * Get all teams
     * @returns {Array} Array of team objects
     */
    getAllTeams() {
        const teams = [];
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            teams.push(this._parseTeamElement(teamElements[i]));
        }

        return teams;
    }

    /**
     * Get a specific team by code
     * @param {string} code - Team code (e.g., 'MI', 'CSK')
     * @returns {Object|null} Team object or null if not found
     */
    getTeam(code) {
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].getElementsByTagName('code')[0];
            if (codeElement && codeElement.textContent.toUpperCase() === code.toUpperCase()) {
                return this._parseTeamElement(teamElements[i]);
            }
        }

        return null;
    }

    /**
     * Get all players for a team
     * @param {string} teamCode - Team code
     * @returns {Array} Array of player objects
     */
    getTeamPlayers(teamCode) {
        const team = this._getTeamElement(teamCode);
        if (!team) return [];

        const players = [];
        const playerElements = team.getElementsByTagName('player');

        for (let i = 0; i < playerElements.length; i++) {
            players.push(this._parsePlayerElement(playerElements[i]));
        }

        return players;
    }

    /**
     * Add a player to a team
     * @param {string} teamCode - Team code
     * @param {Object} playerData - Player object with name, role, country, jersey
     * @returns {Object|null} Added player object or null if team not found
     */
    addPlayer(teamCode, playerData) {
        const team = this._getTeamElement(teamCode);
        if (!team) return null;

        const playersElement = team.getElementsByTagName('players')[0];
        if (!playersElement) return null;

        const playerElement = this.xmlDoc.createElement('player');
        playerElement.setAttribute('id', this._generateId());

        const nameEl = this.xmlDoc.createElement('name');
        nameEl.textContent = playerData.name || '';
        playerElement.appendChild(nameEl);

        const roleEl = this.xmlDoc.createElement('role');
        roleEl.textContent = playerData.role || '';
        playerElement.appendChild(roleEl);

        const countryEl = this.xmlDoc.createElement('country');
        countryEl.textContent = playerData.country || '';
        playerElement.appendChild(countryEl);

        const jerseyEl = this.xmlDoc.createElement('jersey');
        jerseyEl.textContent = playerData.jersey || '';
        playerElement.appendChild(jerseyEl);

        playersElement.appendChild(playerElement);

        return this._parsePlayerElement(playerElement);
    }

    /**
     * Delete a player from a team
     * @param {string} teamCode - Team code
     * @param {string} playerId - Player ID
     * @returns {boolean} True if player was deleted, false otherwise
     */
    deletePlayer(teamCode, playerId) {
        const team = this._getTeamElement(teamCode);
        if (!team) return false;

        const playerElements = team.getElementsByTagName('player');

        for (let i = 0; i < playerElements.length; i++) {
            if (playerElements[i].getAttribute('id') === playerId) {
                playerElements[i].parentNode.removeChild(playerElements[i]);
                return true;
            }
        }

        return false;
    }

    /**
     * Update a player
     * @param {string} teamCode - Team code
     * @param {string} playerId - Player ID
     * @param {Object} playerData - Updated player data
     * @returns {Object|null} Updated player object or null if not found
     */
    updatePlayer(teamCode, playerId, playerData) {
        const team = this._getTeamElement(teamCode);
        if (!team) return null;

        const playerElements = team.getElementsByTagName('player');

        for (let i = 0; i < playerElements.length; i++) {
            if (playerElements[i].getAttribute('id') === playerId) {
                const element = playerElements[i];

                // Update fields
                if (playerData.name) {
                    const nameEl = element.getElementsByTagName('name')[0];
                    if (nameEl) nameEl.textContent = playerData.name;
                }
                if (playerData.role) {
                    const roleEl = element.getElementsByTagName('role')[0];
                    if (roleEl) roleEl.textContent = playerData.role;
                }
                if (playerData.country) {
                    const countryEl = element.getElementsByTagName('country')[0];
                    if (countryEl) countryEl.textContent = playerData.country;
                }
                if (playerData.jersey) {
                    const jerseyEl = element.getElementsByTagName('jersey')[0];
                    if (jerseyEl) jerseyEl.textContent = playerData.jersey;
                }

                return this._parsePlayerElement(element);
            }
        }

        return null;
    }

    /**
     * Clear all players from a team
     * @param {string} teamCode - Team code
     * @returns {boolean} True if cleared, false if team not found
     */
    clearTeamPlayers(teamCode) {
        const team = this._getTeamElement(teamCode);
        if (!team) return false;

        const playersElement = team.getElementsByTagName('players')[0];
        if (!playersElement) return false;

        while (playersElement.firstChild) {
            playersElement.removeChild(playersElement.firstChild);
        }

        return true;
    }

    /**
     * Clear all data (all players from all teams)
     */
    clearAllData() {
        const teams = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teams.length; i++) {
            const playersElement = teams[i].getElementsByTagName('players')[0];
            if (playersElement) {
                while (playersElement.firstChild) {
                    playersElement.removeChild(playersElement.firstChild);
                }
            }
        }
    }

    /**
     * Export current data as XML string
     * @returns {string} XML string representation
     */
    exportXML() {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(this.xmlDoc);
    }

    /**
     * Export current data as JSON for debugging
     * @returns {Object} JSON representation of all teams and players
     */
    exportJSON() {
        return {
            timestamp: new Date().toISOString(),
            teams: this.getAllTeams().map(team => ({
                ...team,
                players: this.getTeamPlayers(team.code)
            }))
        };
    }

    /**
     * Get statistics about the data
     * @returns {Object} Statistics object
     */
    getStatistics() {
        const teams = this.getAllTeams();
        let totalPlayers = 0;

        const teamStats = teams.map(team => {
            const players = this.getTeamPlayers(team.code);
            totalPlayers += players.length;
            return {
                code: team.code,
                name: team.name,
                playerCount: players.length
            };
        });

        return {
            totalTeams: teams.length,
            totalPlayers,
            averagePlayersPerTeam: (totalPlayers / teams.length).toFixed(2),
            teams: teamStats
        };
    }

    // ==================== Private Methods ====================

    /**
     * Get team element by code
     * @private
     */
    _getTeamElement(code) {
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].getElementsByTagName('code')[0];
            if (codeElement && codeElement.textContent.toUpperCase() === code.toUpperCase()) {
                return teamElements[i];
            }
        }

        return null;
    }

    /**
     * Parse team XML element to object
     * @private
     */
    _parseTeamElement(element) {
        const getValue = (tagName) => {
            const el = element.getElementsByTagName(tagName)[0];
            return el ? el.textContent : '';
        };

        return {
            code: getValue('code'),
            name: getValue('name'),
            color: getValue('color'),
            darkColor: getValue('darkColor'),
            city: getValue('city'),
            stadium: getValue('stadium'),
            founded: getValue('founded')
        };
    }

    /**
     * Parse player XML element to object
     * @private
     */
    _parsePlayerElement(element) {
        const getValue = (tagName) => {
            const el = element.getElementsByTagName(tagName)[0];
            return el ? el.textContent : '';
        };

        return {
            id: element.getAttribute('id'),
            name: getValue('name'),
            role: getValue('role'),
            country: getValue('country'),
            jersey: getValue('jersey')
        };
    }

    /**
     * Generate unique ID
     * @private
     */
    _generateId() {
        return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
