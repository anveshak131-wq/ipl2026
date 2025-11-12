/**
 * DataManager - In-Memory XML Data Management
 * 
 * This module uses JavaScript's DOMParser and XMLSerializer to manage
 * team and player data entirely in-memory using XML. No data persists
 * to localStorage, sessionStorage, or any backend.
 */

class DataManager {
    constructor() {
        // Initialize XML document in memory
        this.xmlDoc = this.initializeXML();
    }

    /**
     * Initialize the XML structure with all 10 IPL teams
     * @returns {XMLDocument} Empty XML document with team definitions
     */
    initializeXML() {
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ipl>
    <teams>
        <team>
            <code>MI</code>
            <name>Mumbai Indians</name>
            <players/>
        </team>
        <team>
            <code>CSK</code>
            <name>Chennai Super Kings</name>
            <players/>
        </team>
        <team>
            <code>RCB</code>
            <name>Royal Challengers Bangalore</name>
            <players/>
        </team>
        <team>
            <code>KKR</code>
            <name>Kolkata Knight Riders</name>
            <players/>
        </team>
        <team>
            <code>DC</code>
            <name>Delhi Capitals</name>
            <players/>
        </team>
        <team>
            <code>SRH</code>
            <name>Sunrisers Hyderabad</name>
            <players/>
        </team>
        <team>
            <code>RR</code>
            <name>Rajasthan Royals</name>
            <players/>
        </team>
        <team>
            <code>PBKS</code>
            <name>Punjab Kings</name>
            <players/>
        </team>
        <team>
            <code>GT</code>
            <name>Gujarat Titans</name>
            <players/>
        </team>
        <team>
            <code>LSG</code>
            <name>Lucknow Super Giants</name>
            <players/>
        </team>
    </teams>
</ipl>`;

        const parser = new DOMParser();
        return parser.parseFromString(xmlString, 'application/xml');
    }

    /**
     * Get all teams
     * @returns {Array} Array of team objects with code and name
     */
    getAllTeams() {
        const teams = this.xmlDoc.querySelectorAll('team');
        return Array.from(teams).map(teamNode => ({
            code: teamNode.querySelector('code').textContent,
            name: teamNode.querySelector('name').textContent
        }));
    }

    /**
     * Get a specific team by code
     * @param {string} teamCode - Team code (e.g., 'RCB')
     * @returns {Object} Team object or null
     */
    getTeam(teamCode) {
        const team = this.xmlDoc.querySelector(`team code:contains("${teamCode}")`);
        if (!team) return null;
        return {
            code: teamCode,
            name: team.nextElementSibling.textContent
        };
    }

    /**
     * Get all players for a specific team
     * @param {string} teamCode - Team code (e.g., 'RCB')
     * @returns {Array} Array of player objects
     */
    getTeamPlayers(teamCode) {
        const teamNode = this.xmlDoc.querySelector(`team code:contains("${teamCode}")`).parentElement;
        if (!teamNode) return [];

        const playersNode = teamNode.querySelector('players');
        const playerElements = playersNode.querySelectorAll('player');

        return Array.from(playerElements).map(playerNode => ({
            name: playerNode.querySelector('name').textContent,
            role: playerNode.querySelector('role').textContent,
            jersey: playerNode.querySelector('jersey')?.textContent || null
        }));
    }

    /**
     * Add a player to a team
     * @param {string} teamCode - Team code
     * @param {Object} player - Player object with name, role, jersey
     */
    addPlayer(teamCode, player) {
        const teamNode = this.getTeamNode(teamCode);
        if (!teamNode) return;

        const playersNode = teamNode.querySelector('players');
        const playerElement = this.xmlDoc.createElement('player');

        const nameEl = this.xmlDoc.createElement('name');
        nameEl.textContent = player.name;
        playerElement.appendChild(nameEl);

        const roleEl = this.xmlDoc.createElement('role');
        roleEl.textContent = player.role;
        playerElement.appendChild(roleEl);

        const jerseyEl = this.xmlDoc.createElement('jersey');
        jerseyEl.textContent = player.jersey || '';
        playerElement.appendChild(jerseyEl);

        playersNode.appendChild(playerElement);
    }

    /**
     * Delete a player from a team by index
     * @param {string} teamCode - Team code
     * @param {number} index - Player index
     */
    deletePlayer(teamCode, index) {
        const players = this.getTeamPlayers(teamCode);
        if (index < 0 || index >= players.length) return;

        const teamNode = this.getTeamNode(teamCode);
        const playerElements = teamNode.querySelectorAll('player');
        if (playerElements[index]) {
            playerElements[index].remove();
        }
    }

    /**
     * Get team node from XML
     * @param {string} teamCode - Team code
     * @returns {Element} Team node
     */
    getTeamNode(teamCode) {
        const teams = this.xmlDoc.querySelectorAll('team');
        for (let team of teams) {
            if (team.querySelector('code').textContent === teamCode) {
                return team;
            }
        }
        return null;
    }

    /**
     * Export current state as XML string
     * @returns {string} XML representation of current data
     */
    exportXML() {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(this.xmlDoc);
    }

    /**
     * Log current data structure (for debugging)
     */
    debugLog() {
        console.log('=== IPL Teams Data (In-Memory XML) ===');
        const teams = this.getAllTeams();
        teams.forEach(team => {
            const players = this.getTeamPlayers(team.code);
            console.log(`${team.name} (${team.code}): ${players.length} players`);
            players.forEach(p => {
                console.log(`  - ${p.name} (${p.role})`);
            });
        });
    }
}
