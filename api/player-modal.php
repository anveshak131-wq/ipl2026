<?php
/**
 * Player Modal Server-Side Renderer (PHP)
 * Returns complete HTML for player modal - no JavaScript dependencies
 */

header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get parameters
$team = isset($_GET['team']) ? strtoupper(trim($_GET['team'])) : '';
$playerName = isset($_GET['player']) ? trim($_GET['player']) : '';

if (empty($team) || empty($playerName)) {
    http_response_code(400);
    echo '<div class="empty-state"><h4>Error</h4><p>Team and player name are required</p></div>';
    exit();
}

// Team logo mapping
$teamLogos = [
    'MI' => 'assets/mi_logo_new.svg',
    'CSK' => 'assets/csk_logo_new.svg',
    'RCB' => 'assets/rcb_logo_new.svg',
    'KKR' => 'assets/kkr_logo_new.svg',
    'DC' => 'assets/dc_logo_new.svg',
    'SRH' => 'assets/srh_logo_new.svg',
    'RR' => 'assets/rr_logo_new.svg',
    'PBKS' => 'assets/kxip_logo_new.svg',
    'KXIP' => 'assets/kxip_logo_new.svg',
    'GT' => 'assets/gt_logo_new.svg',
    'LSG' => 'assets/lsg_logo_new.svg'
];

$logoPath = $teamLogos[$team] ?? 'assets/ipl_logo_new.svg';

// Try to fetch player data from Vercel API
$apiUrl = "https://iplcrickethub-kappa.vercel.app/api/admin/players?team=" . urlencode($team);
$playerData = null;

// Initialize cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    $data = json_decode($response, true);
    $players = $data['data'] ?? ($data ?? []);
    
    if (is_array($players)) {
        // Find the player by name (case-insensitive)
        foreach ($players as $p) {
            if (isset($p['name']) && strcasecmp(trim($p['name']), $playerName) === 0) {
                $playerData = $p;
                break;
            }
        }
    }
}

// If no player found, return error
if (!$playerData) {
    echo '<div class="empty-state"><h4>Player Not Found</h4><p>Player data not available</p></div>';
    exit();
}

// Parse stats
$stats = [];
if (isset($playerData['stats'])) {
    if (is_string($playerData['stats'])) {
        $stats = json_decode($playerData['stats'], true) ?: [];
    } else {
        $stats = $playerData['stats'];
    }
}

// Helper function to safely get value
function safeGet($data, $key, $default = '') {
    return isset($data[$key]) && $data[$key] !== null ? htmlspecialchars($data[$key], ENT_QUOTES, 'UTF-8') : $default;
}

// Build badges
$badges = [];
if (!empty($playerData['isCaptain'])) $badges[] = '<span class="modal-badge">👑 Captain</span>';
if (!empty($playerData['isViceCaptain'])) $badges[] = '<span class="modal-badge">⭐ Vice Captain</span>';
if (!empty($playerData['isForeign'])) $badges[] = '<span class="modal-badge">🌏 Overseas</span>';
$role = strtolower(safeGet($playerData, 'role', ''));
if (strpos($role, 'wicket') !== false) $badges[] = '<span class="modal-badge">🧤 Wicket-Keeper</span>';
if (empty($badges)) $badges[] = '<span class="modal-badge">Player</span>';

// Build HTML
?>
<div class="modal-player-header">
    <div class="modal-player-logo">
        <img src="<?php echo htmlspecialchars($logoPath, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo safeGet($playerData, 'name'); ?>">
    </div>
    <h2 class="modal-player-name"><?php echo safeGet($playerData, 'name', 'Unknown Player'); ?></h2>
    <p class="modal-player-role"><?php echo safeGet($playerData, 'role', 'Player'); ?> • <?php echo $team; ?></p>
    <div class="modal-player-badges">
        <?php echo implode('', $badges); ?>
    </div>
</div>
<div class="modal-player-details">
    <div class="player-details-grid">
        <!-- Basic Information -->
        <div class="details-section">
            <h4>Basic Information</h4>
            <?php if (!empty($playerData['age'])): ?>
            <div class="detail-item">
                <div class="detail-label">Age</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'age'); ?></div>
            </div>
            <?php endif; ?>
            <?php if (!empty($playerData['nationality'])): ?>
            <div class="detail-item">
                <div class="detail-label">Nationality</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'nationality'); ?></div>
            </div>
            <?php endif; ?>
            <?php if (!empty($playerData['jersey']) || !empty($playerData['number'])): ?>
            <div class="detail-item">
                <div class="detail-label">Jersey</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'jersey', safeGet($playerData, 'number')); ?></div>
            </div>
            <?php endif; ?>
            <?php if (!empty($playerData['battingStyle']) || !empty($playerData['batting style'])): ?>
            <div class="detail-item">
                <div class="detail-label">Batting</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'battingStyle', safeGet($playerData, 'batting style')); ?></div>
            </div>
            <?php endif; ?>
            <?php if (!empty($playerData['bowlingStyle']) || !empty($playerData['bowling style'])): ?>
            <div class="detail-item">
                <div class="detail-label">Bowling</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'bowlingStyle', safeGet($playerData, 'bowling style')); ?></div>
            </div>
            <?php endif; ?>
            <?php if (!empty($playerData['allrounderType']) || !empty($playerData['allrounder type'])): ?>
            <div class="detail-item">
                <div class="detail-label">Type</div>
                <div class="detail-value"><?php echo safeGet($playerData, 'allrounderType', safeGet($playerData, 'allrounder type')); ?></div>
            </div>
            <?php endif; ?>
        </div>
        
        <?php
        // Batting Statistics
        $hasBattingStats = !empty($stats['matches']) || !empty($stats['runs']) || !empty($stats['innings']);
        if ($hasBattingStats):
        ?>
        <div class="details-section">
            <h4>Batting Statistics</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['matches']) ? $stats['matches'] : 0; ?></div>
                    <div class="stat-label">Matches</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['innings']) ? $stats['innings'] : 0; ?></div>
                    <div class="stat-label">Innings</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['runs']) ? $stats['runs'] : 0; ?></div>
                    <div class="stat-label">Runs</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['battingAvg']) ? $stats['battingAvg'] : 0; ?></div>
                    <div class="stat-label">Average</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['strikeRate']) ? $stats['strikeRate'] : 0; ?></div>
                    <div class="stat-label">Strike Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['highestScore']) ? $stats['highestScore'] : 0; ?></div>
                    <div class="stat-label">Highest</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['centuries']) ? $stats['centuries'] : 0; ?></div>
                    <div class="stat-label">100s</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['fifties']) ? $stats['fifties'] : 0; ?></div>
                    <div class="stat-label">50s</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['sixes']) ? $stats['sixes'] : 0; ?></div>
                    <div class="stat-label">Sixes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['fours']) ? $stats['fours'] : 0; ?></div>
                    <div class="stat-label">Fours</div>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <?php
        // Bowling Statistics
        $hasBowlingStats = !empty($stats['wickets']) || !empty($stats['bowlingAvg']) || !empty($stats['economy']);
        if ($hasBowlingStats):
        ?>
        <div class="details-section">
            <h4>Bowling Statistics</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['wickets']) ? $stats['wickets'] : 0; ?></div>
                    <div class="stat-label">Wickets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['bowlingAvg']) ? $stats['bowlingAvg'] : 0; ?></div>
                    <div class="stat-label">Average</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['economy']) ? $stats['economy'] : 0; ?></div>
                    <div class="stat-label">Economy</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['bestBowling']) ? htmlspecialchars($stats['bestBowling'], ENT_QUOTES, 'UTF-8') : '-'; ?></div>
                    <div class="stat-label">Best</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['fiveWickets']) ? $stats['fiveWickets'] : 0; ?></div>
                    <div class="stat-label">5-Wickets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number"><?php echo isset($stats['fourWickets']) ? $stats['fourWickets'] : 0; ?></div>
                    <div class="stat-label">4-Wickets</div>
                </div>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if (!$hasBattingStats && !$hasBowlingStats): ?>
        <div class="details-section">
            <div class="empty-state">
                <h4>No statistics available</h4>
                <p>Stats will be displayed once added to the system.</p>
            </div>
        </div>
        <?php endif; ?>
    </div>
</div>

