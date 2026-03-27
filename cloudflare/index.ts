// Cloudflare Worker (TypeScript) using Workers KV to store player lists and per-player statistics.
// Key design:
//  - players:{TEAM} => JSON array of player objects (name, role, etc.)
//  - stats:{TEAM}:{PLAYER_ID} => per-player JSON stats object (persist across re-uploads)
// Player identity (PLAYER_ID): prefer `player.id` if present, otherwise a slug derived from `player.name`.

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function playerIdFor(player: any) {
  if (!player) return null;
  if (player.id) return String(player.id);
  if (player.name) {
    return String(player.name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  }
  return null;
}

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname === '/' && request.method === 'GET') {
      return new Response('Player storage KV worker', { status: 200, headers: CORS_HEADERS });
    }

    // Players list endpoints
    if (url.pathname.endsWith('/api/admin/players')) {
      if (request.method === 'GET') {
        const team = url.searchParams.get('team');
        if (!team) return jsonResponse({ error: 'team query parameter required' }, 400);
        const key = `players:${team.toUpperCase()}`;
        const stored = await env.PLAYERS_KV.get(key);
        const players = stored ? JSON.parse(stored) : [];
        // For convenience, attach a computed playerId to each returned player
        const playersWithId = players.map((p: any) => ({ ...p, __playerId: playerIdFor(p) }));
        return jsonResponse({ team: team.toUpperCase(), players: playersWithId });
      }

      if (request.method === 'POST') {
        let body: any;
        try {
          body = await request.json();
        } catch (err: any) {
          return jsonResponse({ error: 'invalid JSON' }, 400);
        }

        const team = (body.team || '').toString().toUpperCase();
        if (!team) return jsonResponse({ error: 'team is required' }, 400);

        const key = `players:${team}`;

        // Overwrite with array (merge: preserve existing per-player stats)
        if (Array.isArray(body.players)) {
          const existingRaw = await env.PLAYERS_KV.get(key);
          const existingPlayers = existingRaw ? JSON.parse(existingRaw) : [];

          // Build map of existing players by id for quick lookup
          const existingMap: Record<string, any> = {};
          for (const p of existingPlayers) {
            const id = playerIdFor(p);
            if (id) existingMap[id] = p;
          }

          // For each incoming player, preserve stats if present in KV stats key
          const mergedPlayers = [];
          for (const p of body.players) {
            const id = playerIdFor(p);
            const playerCopy = { ...p };
            if (id) {
              // Attach persisted stats from stats:{team}:{id} if present
              const statsKey = `stats:${team}:${id}`;
              const statsRaw = await env.PLAYERS_KV.get(statsKey);
              if (statsRaw) {
                try {
                  playerCopy.stats = JSON.parse(statsRaw);
                } catch (e: any) {
                  // ignore parse errors
                }
              } else if (existingMap[id] && existingMap[id].stats) {
                // fallback: if existing player entry contained stats field
                playerCopy.stats = existingMap[id].stats;
              }
            }
            mergedPlayers.push(playerCopy);
          }

          // Store merged players array
          await env.PLAYERS_KV.put(key, JSON.stringify(mergedPlayers));
          return jsonResponse({ ok: true, team, count: mergedPlayers.length });
        }

        // Append single player (preserve stats if any exist)
        if (body.player && typeof body.player === 'object') {
          const existingRaw = await env.PLAYERS_KV.get(key);
          const arr = existingRaw ? JSON.parse(existingRaw) : [];
          const p = body.player;
          const id = playerIdFor(p);
          const playerCopy = { ...p };
          if (id) {
            const statsKey = `stats:${team}:${id}`;
            const statsRaw = await env.PLAYERS_KV.get(statsKey);
            if (statsRaw) {
              try { playerCopy.stats = JSON.parse(statsRaw); } catch (e: any) {}
            }
          }
          arr.push(playerCopy);
          await env.PLAYERS_KV.put(key, JSON.stringify(arr));
          return jsonResponse({ ok: true, team, count: arr.length });
        }

        return jsonResponse({ error: 'invalid payload; send {team, players:[...]} or {team, player:{...}}' }, 400);
      }
    }

    // Per-player stats endpoints
    if (url.pathname.endsWith('/api/admin/player-stats')) {
      if (request.method === 'GET') {
        const team = url.searchParams.get('team');
        const playerId = url.searchParams.get('playerId');
        if (!team || !playerId) return jsonResponse({ error: 'team and playerId are required' }, 400);
        const statsKey = `stats:${team.toUpperCase()}:${playerId}`;
        const statsRaw = await env.PLAYERS_KV.get(statsKey);
        const stats = statsRaw ? JSON.parse(statsRaw) : {};
        return jsonResponse({ team: team.toUpperCase(), playerId, stats });
      }

      if (request.method === 'POST') {
        // Update or create stats for a player
        let body: any;
        try { body = await request.json(); } catch (err: any) { return jsonResponse({ error: 'invalid JSON' }, 400); }
        const team = (body.team || '').toString().toUpperCase();
        const playerId = body.playerId || (body.player && playerIdFor(body.player));
        const stats = body.stats;
        if (!team || !playerId || typeof stats !== 'object') return jsonResponse({ error: 'team, playerId and stats object required' }, 400);
        const statsKey = `stats:${team}:${playerId}`;
        await env.PLAYERS_KV.put(statsKey, JSON.stringify(stats));
        return jsonResponse({ ok: true, team, playerId });
      }
    }

    return new Response('Not found', { status: 404, headers: CORS_HEADERS });
  }
};

function jsonResponse(obj: any, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
