/**
 * DataManager - With Cloudflare Workers KV Support
 * Automatically saves/loads data from KV storage for persistence
 * Falls back to in-memory storage if KV is unavailable
 */

class DataManager {
    constructor() {
        this.xmlDoc = null;
        this.kvEnabled = false;
        this.kvApiUrl = 'https://ipl-teams-manager-v2.anvesh-ak-131.workers.dev/api/teams';
        this.isInitialized = false;
        this.initializeData();
    }

    /**
     * Initialize data - load from KV if available
     */
    initializeData() {
        // Load from KV storage (non-blocking)
        this.loadFromKV().then(() => {
            if (!this.isInitialized) {
                this.createDefaultData();
            }
            this.isInitialized = true;
        }).catch(() => {
            if (!this.isInitialized) {
                this.createDefaultData();
            }
            this.isInitialized = true;
        });

        // Set timeout to ensure data is loaded
        setTimeout(() => {
            if (!this.isInitialized) {
                this.createDefaultData();
                this.isInitialized = true;
            }
        }, 2000);
    }

    /**
     * Load data from KV storage
     */
    async loadFromKV() {
        try {
            const response = await fetch(this.kvApiUrl);
            
            if (response.ok) {
                const xmlString = await response.text();
                const parser = new DOMParser();
                this.xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                
                if (this.xmlDoc.getElementsByTagName('parsererror').length === 0) {
                    this.kvEnabled = true;
                    console.log('✅ Data loaded from KV storage');
                    this.isInitialized = true;
                    return true;
                }
            }
        } catch (error) {
            console.log('ℹ️ KV storage not available, using in-memory data:', error.message);
        }

        return false;
    }

    /**
     * Create default in-memory data
     */
    createDefaultData() {
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
            <code>KXIP</code>
            <name>Kings XI Punjab</name>
            <color>#C41E3A</color>
            <darkColor>#8B1428</darkColor>
            <city>Chandigarh</city>
            <stadium>PCA Stadium</stadium>
            <founded>2008</founded>
            <players></players>
        </team>
        <team>
            <code>RR</code>
            <name>Rajasthan Royals</name>
            <color>#1F4788</color>
            <darkColor>#132D5C</darkColor>
            <city>Jaipur</city>
            <stadium>Sawai Mansingh Stadium</stadium>
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

        if (this.xmlDoc.getElementsByTagName('parsererror').length === 0) {
            console.log('ℹ️ Using default in-memory data');
            this.isInitialized = true;
        } else {
            throw new Error('Failed to initialize data');
        }
    }

    /**
     * Save data to KV storage
     */
    async saveToKV() {
        if (!this.kvEnabled) return false;

        try {
            const xmlString = new XMLSerializer().serializeToString(this.xmlDoc);
            
            const response = await fetch(this.kvApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/xml' },
                body: xmlString,
            });

            if (response.ok) {
                console.log('✅ Data saved to KV storage');
                return true;
            }
        } catch (error) {
            console.error('❌ Failed to save to KV:', error);
        }

        return false;
    }

    /**
     * Get all teams
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
     * Get team by code
     */
    getTeam(code) {
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].querySelector('code');
            if (codeElement?.textContent === code) {
                return this._parseTeamElement(teamElements[i]);
            }
        }

        return null;
    }

    /**
     * Get team's players
     */
    getTeamPlayers(teamCode) {
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].querySelector('code');
            if (codeElement?.textContent === teamCode) {
                const playersElement = teamElements[i].querySelector('players');
                const players = [];

                if (playersElement) {
                    const playerElements = playersElement.querySelectorAll('player');
                    for (let j = 0; j < playerElements.length; j++) {
                        players.push(this._parsePlayerElement(playerElements[j]));
                    }
                }

                return players;
            }
        }

        return [];
    }

    /**
     * Add player to team
     */
    addPlayer(teamCode, playerData) {
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].querySelector('code');
            if (codeElement?.textContent === teamCode) {
                // Get or create players container
                let playersElement = teamElements[i].querySelector('players');
                if (!playersElement) {
                    playersElement = this.xmlDoc.createElement('players');
                    teamElements[i].appendChild(playersElement);
                }

                // Create new player element
                const playerElement = this.xmlDoc.createElement('player');
                playerElement.innerHTML = `
                    <name>${this._escapeXml(playerData.name)}</name>
                    <role>${this._escapeXml(playerData.role)}</role>
                    <country>${this._escapeXml(playerData.country || '')}</country>
                    <jersey>${playerData.jersey || ''}</jersey>
                `;

                playersElement.appendChild(playerElement);

                // Save to KV if enabled
                this.saveToKV();

                return true;
            }
        }

        return false;
    }

    /**
     * Remove player from team
     */
    removePlayer(teamCode, playerName) {
        const players = this.getTeamPlayers(teamCode);
        const teamElements = this.xmlDoc.getElementsByTagName('team');

        for (let i = 0; i < teamElements.length; i++) {
            const codeElement = teamElements[i].querySelector('code');
            if (codeElement?.textContent === teamCode) {
                const playersElement = teamElements[i].querySelector('players');
                if (playersElement) {
                    const playerElements = playersElement.querySelectorAll('player');
                    for (let j = 0; j < playerElements.length; j++) {
                        const nameElement = playerElements[j].querySelector('name');
                        if (nameElement?.textContent === playerName) {
                            playersElement.removeChild(playerElements[j]);
                            this.saveToKV();
                            return true;
                        }
                    }
                }
                break;
            }
        }

        return false;
    }

    /**
     * Export as XML
     */
    exportXML() {
        return new XMLSerializer().serializeToString(this.xmlDoc);
    }

    /**
     * Export as JSON
     */
    exportJSON() {
        const teams = this.getAllTeams();
        return JSON.stringify({ teams }, null, 2);
    }

    /**
     * Clear all data
     */
    async clearAllData() {
        try {
            const response = await fetch(this.kvApiUrl, { method: 'DELETE' });
            if (response.ok) {
                console.log('✅ Data cleared from KV storage');
            }
        } catch (error) {
            console.error('Error clearing KV:', error);
        }

        this.createDefaultData();
    }

    /**
     * Parse team element
     */
    _parseTeamElement(element) {
        return {
            code: element.querySelector('code')?.textContent || '',
            name: element.querySelector('name')?.textContent || '',
            color: element.querySelector('color')?.textContent || '#000',
            darkColor: element.querySelector('darkColor')?.textContent || '#000',
            city: element.querySelector('city')?.textContent || '',
            stadium: element.querySelector('stadium')?.textContent || '',
            founded: element.querySelector('founded')?.textContent || '',
        };
    }

    /**
     * Parse player element
     */
    _parsePlayerElement(element) {
        return {
            name: element.querySelector('name')?.textContent || '',
            role: element.querySelector('role')?.textContent || '',
            country: element.querySelector('country')?.textContent || '',
            jersey: element.querySelector('jersey')?.textContent || '',
        };
    }

    /**
     * Escape XML special characters
     */
    _escapeXml(str) {
        if (!str) return '';
        return str.replace(/[<>&'"]/g, (c) => {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case "'": return '&apos;';
                case '"': return '&quot;';
                default: return c;
            }
        });
    }
}
