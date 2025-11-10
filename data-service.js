// Dynamic IPL Data Service
// This service provides live data simulation with automatic updates

class IPLDataService {
    constructor() {
        this.updateInterval = 30000; // Update every 30 seconds
        this.dataCache = {};
        this.callbacks = {};
    }

    // Simulate live fixture updates
    async getLiveFixtures() {
        // In production, this would fetch from a real API like:
        // return fetch('https://api.cricket-data.com/ipl/fixtures')
        
        // Simulated data with random updates
        const fixtures = [
            {
                id: 1, match: 1,
                date: '2026-09-18',
                team1: { name: 'Mumbai Indians', shortName: 'MI', logo: 'mi_logo.png' },
                team2: { name: 'Chennai Super Kings', shortName: 'CSK', logo: 'csk_logo.png' },
                status: 'live', // Randomly switches between live, upcoming, completed
                venue: 'Wankhede Stadium',
                time: '19:30',
                score1: '185/4 (18.2)',
                score2: '180/6 (20.0)',
                progress: 'Chasing 185 runs - CSK need 5 runs in 10 balls'
            },
            {
                id: 2, match: 2,
                date: '2026-09-19',
                team1: { name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: 'rcb_logo.png' },
                team2: { name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: 'srh_logo.png' },
                status: 'upcoming',
                venue: 'M Chinnaswamy Stadium',
                time: '19:30'
            },
            {
                id: 3, match: 3,
                date: '2026-09-20',
                team1: { name: 'Kolkata Knight Riders', shortName: 'KKR', logo: 'kkr_logo.png' },
                team2: { name: 'Delhi Capitals', shortName: 'DC', logo: 'dc_logo.png' },
                status: 'completed',
                venue: 'Eden Gardens',
                time: '19:30',
                result: 'DC won by 7 wickets',
                score1: '172/5',
                score2: '175/3'
            },
            {
                id: 4, match: 4,
                date: '2026-09-21',
                team1: { name: 'Gujarat Titans', shortName: 'GT', logo: 'ipl_logo.svg' },
                team2: { name: 'Lucknow Super Giants', shortName: 'LSG', logo: 'ipl_logo.svg' },
                status: 'upcoming',
                venue: 'Narendra Modi Stadium',
                time: '19:30'
            }
        ];

        // Simulate status changes
        const randomMatch = fixtures[Math.floor(Math.random() * fixtures.length)];
        if (Math.random() > 0.7 && randomMatch.status === 'live') {
            randomMatch.status = 'completed';
            randomMatch.result = `${randomMatch.team2.shortName} won by 3 wickets`;
        }

        return fixtures;
    }

    // Simulate live points table
    async getPointsTable() {
        return [
            { name: "Royal Challengers Bangalore", shortName: "RCB", logo: "rcb_logo.png", 
              played: 5, won: 4, lost: 1, nrr: 0.523, points: 8 },
            { name: "Mumbai Indians", shortName: "MI", logo: "mi_logo.png", 
              played: 5, won: 4, lost: 1, nrr: 0.412, points: 8 },
            { name: "Chennai Super Kings", shortName: "CSK", logo: "csk_logo.png", 
              played: 5, won: 3, lost: 2, nrr: 0.285, points: 6 },
            { name: "Kolkata Knight Riders", shortName: "KKR", logo: "kkr_logo.png", 
              played: 5, won: 3, lost: 2, nrr: 0.198, points: 6 },
            { name: "Gujarat Titans", shortName: "GT", logo: "ipl_logo.svg", 
              played: 5, won: 3, lost: 2, nrr: 0.105, points: 6 },
            { name: "Lucknow Super Giants", shortName: "LSG", logo: "ipl_logo.svg", 
              played: 5, won: 2, lost: 3, nrr: -0.102, points: 4 },
            { name: "Sunrisers Hyderabad", shortName: "SRH", logo: "srh_logo.png", 
              played: 5, won: 2, lost: 3, nrr: -0.245, points: 4 },
            { name: "Delhi Capitals", shortName: "DC", logo: "dc_logo.png", 
              played: 5, won: 2, lost: 3, nrr: -0.389, points: 4 },
            { name: "Rajasthan Royals", shortName: "RR", logo: "rr_logo.png", 
              played: 5, won: 1, lost: 4, nrr: -0.456, points: 2 },
            { name: "Punjab Kings", shortName: "KXIP", logo: "kxip_logo.png", 
              played: 5, won: 1, lost: 4, nrr: -0.678, points: 2 }
        ];
    }

    // Simulate live match scores
    async getLiveScores() {
        return {
            live: [
                {
                    id: 1,
                    team1: { name: 'Mumbai Indians', shortName: 'MI', logo: 'mi_logo.png' },
                    team2: { name: 'Chennai Super Kings', shortName: 'CSK', logo: 'csk_logo.png' },
                    status: 'live',
                    progress: 'CSK 156/3 (16.2 ov) - Need 29 runs in 22 balls',
                    currentBatsmen: ['MS Dhoni 45*', 'R Jadeja 22*'],
                    bowler: 'J Bumrah 4-0-32-2',
                    recentOvers: ['4', '1', '6', '2', '1', 'W', '1', '1', '0', '2']
                }
            ],
            upcoming: [
                {
                    id: 2,
                    team1: { name: 'RCB', logo: 'rcb_logo.png' },
                    team2: { name: 'SRH', logo: 'srh_logo.png' },
                    date: 'Today',
                    time: '19:30',
                    venue: 'M Chinnaswamy Stadium'
                }
            ],
            completed: [
                {
                    id: 3,
                    team1: { name: 'KKR', logo: 'kkr_logo.png', score: '172/5 (20.0)' },
                    team2: { name: 'DC', logo: 'dc_logo.png', score: '175/3 (19.1)' },
                    result: 'DC won by 7 wickets',
                    motm: 'D Warner - 78 (52)'
                }
            ]
        };
    }

    // Start auto-refresh for a specific data type
    startAutoRefresh(dataType, callback) {
        const interval = setInterval(async () => {
            let data;
            switch(dataType) {
                case 'fixtures':
                    data = await this.getLiveFixtures();
                    break;
                case 'points':
                    data = await this.getPointsTable();
                    break;
                case 'scores':
                    data = await this.getLiveScores();
                    break;
            }
            if (callback) callback(data);
        }, this.updateInterval);

        return interval;
    }

    // Add team logos including GT and LSG
    getTeamLogo(teamShortName) {
        const logos = {
            'RCB': 'rcb_logo.png',
            'MI': 'mi_logo.png',
            'CSK': 'csk_logo.png',
            'SRH': 'srh_logo.png',
            'KXIP': 'kxip_logo.png',
            'KKR': 'kkr_logo.png',
            'DC': 'dc_logo.png',
            'RR': 'rr_logo.png',
            'GT': 'ipl_logo.svg',
            'LSG': 'ipl_logo.svg'
        };
        return logos[teamShortName] || 'ipl_logo.svg';
    }
}

// Make it globally available
window.IPLDataService = IPLDataService;
