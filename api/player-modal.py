#!/usr/bin/env python3
"""
Player Modal Server-Side Renderer (Python/Flask)
Returns complete HTML for player modal - no JavaScript dependencies
"""

from flask import Flask, request, Response
from flask_cors import CORS
import json
import requests
import html

app = Flask(__name__)
CORS(app)

# Team logo mapping
TEAM_LOGOS = {
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
}

def safe_get(data, key, default=''):
    """Safely get value from dictionary and escape HTML"""
    value = data.get(key) if isinstance(data, dict) else default
    if value is None:
        return default
    return html.escape(str(value))

def fetch_player_data(team, player_name):
    """Fetch player data from Vercel API"""
    api_url = f"https://iplcrickethub-kappa.vercel.app/api/admin/players?team={team}"
    
    try:
        response = requests.get(api_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            players = data.get('data', []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
            
            # Find player by name (case-insensitive)
            for player in players:
                if player.get('name', '').strip().lower() == player_name.strip().lower():
                    return player
    except Exception as e:
        print(f"Error fetching player data: {e}")
    
    return None

def render_modal_html(player_data, team, logo_path):
    """Render the modal HTML"""
    if not player_data:
        return '<div class="empty-state"><h4>Player Not Found</h4><p>Player data not available</p></div>'
    
    # Parse stats
    stats = {}
    if 'stats' in player_data:
        if isinstance(player_data['stats'], str):
            try:
                stats = json.loads(player_data['stats'])
            except:
                stats = {}
        elif isinstance(player_data['stats'], dict):
            stats = player_data['stats']
    
    # Build badges
    badges = []
    if player_data.get('isCaptain'):
        badges.append('<span class="modal-badge">👑 Captain</span>')
    if player_data.get('isViceCaptain'):
        badges.append('<span class="modal-badge">⭐ Vice Captain</span>')
    if player_data.get('isForeign'):
        badges.append('<span class="modal-badge">🌏 Overseas</span>')
    role = safe_get(player_data, 'role', '').lower()
    if 'wicket' in role:
        badges.append('<span class="modal-badge">🧤 Wicket-Keeper</span>')
    if not badges:
        badges.append('<span class="modal-badge">Player</span>')
    
    # Build HTML
    html_parts = []
    html_parts.append('<div class="modal-player-header">')
    html_parts.append(f'    <div class="modal-player-logo">')
    html_parts.append(f'        <img src="{html.escape(logo_path)}" alt="{safe_get(player_data, "name")}">')
    html_parts.append('    </div>')
    html_parts.append(f'    <h2 class="modal-player-name">{safe_get(player_data, "name", "Unknown Player")}</h2>')
    html_parts.append(f'    <p class="modal-player-role">{safe_get(player_data, "role", "Player")} • {team}</p>')
    html_parts.append('    <div class="modal-player-badges">')
    html_parts.append('        ' + ''.join(badges))
    html_parts.append('    </div>')
    html_parts.append('</div>')
    html_parts.append('<div class="modal-player-details">')
    html_parts.append('    <div class="player-details-grid">')
    
    # Basic Information
    html_parts.append('        <div class="details-section">')
    html_parts.append('            <h4>Basic Information</h4>')
    
    if player_data.get('age'):
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Age</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get(player_data, "age")}</div>')
        html_parts.append('            </div>')
    
    if player_data.get('nationality'):
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Nationality</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get(player_data, "nationality")}</div>')
        html_parts.append('            </div>')
    
    jersey = player_data.get('jersey') or player_data.get('number')
    if jersey:
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Jersey</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get({"jersey": jersey}, "jersey")}</div>')
        html_parts.append('            </div>')
    
    batting_style = player_data.get('battingStyle') or player_data.get('batting style')
    if batting_style:
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Batting</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get({"style": batting_style}, "style")}</div>')
        html_parts.append('            </div>')
    
    bowling_style = player_data.get('bowlingStyle') or player_data.get('bowling style')
    if bowling_style:
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Bowling</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get({"style": bowling_style}, "style")}</div>')
        html_parts.append('            </div>')
    
    allrounder_type = player_data.get('allrounderType') or player_data.get('allrounder type')
    if allrounder_type:
        html_parts.append('            <div class="detail-item">')
        html_parts.append('                <div class="detail-label">Type</div>')
        html_parts.append(f'                <div class="detail-value">{safe_get({"type": allrounder_type}, "type")}</div>')
        html_parts.append('            </div>')
    
    html_parts.append('        </div>')
    
    # Batting Statistics
    has_batting_stats = stats.get('matches') or stats.get('runs') or stats.get('innings')
    if has_batting_stats:
        html_parts.append('        <div class="details-section">')
        html_parts.append('            <h4>Batting Statistics</h4>')
        html_parts.append('            <div class="stats-grid">')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("matches", 0)}</div><div class="stat-label">Matches</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("innings", 0)}</div><div class="stat-label">Innings</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("runs", 0)}</div><div class="stat-label">Runs</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("battingAvg", 0)}</div><div class="stat-label">Average</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("strikeRate", 0)}</div><div class="stat-label">Strike Rate</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("highestScore", 0)}</div><div class="stat-label">Highest</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("centuries", 0)}</div><div class="stat-label">100s</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("fifties", 0)}</div><div class="stat-label">50s</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("sixes", 0)}</div><div class="stat-label">Sixes</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("fours", 0)}</div><div class="stat-label">Fours</div></div>')
        html_parts.append('            </div>')
        html_parts.append('        </div>')
    
    # Bowling Statistics
    has_bowling_stats = stats.get('wickets') or stats.get('bowlingAvg') or stats.get('economy')
    if has_bowling_stats:
        html_parts.append('        <div class="details-section">')
        html_parts.append('            <h4>Bowling Statistics</h4>')
        html_parts.append('            <div class="stats-grid">')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("wickets", 0)}</div><div class="stat-label">Wickets</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("bowlingAvg", 0)}</div><div class="stat-label">Average</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("economy", 0)}</div><div class="stat-label">Economy</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{html.escape(str(stats.get("bestBowling", "-")))}</div><div class="stat-label">Best</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("fiveWickets", 0)}</div><div class="stat-label">5-Wickets</div></div>')
        html_parts.append(f'                <div class="stat-item"><div class="stat-number">{stats.get("fourWickets", 0)}</div><div class="stat-label">4-Wickets</div></div>')
        html_parts.append('            </div>')
        html_parts.append('        </div>')
    
    if not has_batting_stats and not has_bowling_stats:
        html_parts.append('        <div class="details-section">')
        html_parts.append('            <div class="empty-state">')
        html_parts.append('                <h4>No statistics available</h4>')
        html_parts.append('                <p>Stats will be displayed once added to the system.</p>')
        html_parts.append('            </div>')
        html_parts.append('        </div>')
    
    html_parts.append('    </div>')
    html_parts.append('</div>')
    
    return '\n'.join(html_parts)

@app.route('/api/player-modal', methods=['GET', 'OPTIONS'])
def player_modal():
    """Get player modal HTML"""
    if request.method == 'OPTIONS':
        return Response('', status=200, headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        })
    
    team = request.args.get('team', '').upper().strip()
    player_name = request.args.get('player', '').strip()
    
    if not team or not player_name:
        return Response(
            '<div class="empty-state"><h4>Error</h4><p>Team and player name are required</p></div>',
            status=400,
            mimetype='text/html',
            headers={'Access-Control-Allow-Origin': '*'}
        )
    
    logo_path = TEAM_LOGOS.get(team, 'assets/ipl_logo_new.svg')
    player_data = fetch_player_data(team, player_name)
    html_content = render_modal_html(player_data, team, logo_path)
    
    return Response(
        html_content,
        mimetype='text/html',
        headers={'Access-Control-Allow-Origin': '*'}
    )

if __name__ == '__main__':
    print("🎯 Player Modal API Server Starting...")
    print("📡 Server running on http://localhost:5001")
    print("📖 Endpoint: http://localhost:5001/api/player-modal?team=RCB&player=PlayerName")
    app.run(debug=True, host='0.0.0.0', port=5001)

