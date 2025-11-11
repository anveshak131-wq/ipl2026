/**
 * Cloudflare Worker to store player data in Workers KV.
 *
 * Requirements:
 *  - Create a KV namespace in Cloudflare dashboard and bind it to the Worker as `PLAYERS_KV`.
 *  - Deploy this Worker (or use Pages Functions) and set the CF_API_ENDPOINT in `admin-upload.html` to the Worker URL.
 *
 * Behavior:
 *  - POST /api/admin/players with JSON { team: 'RCB', players: [ ... ] } will overwrite the team's player list.
 *  - POST with { team: 'RCB', player: {...} } will append a single player to the team's list.
 *  - GET /api/admin/players?team=RCB returns the stored list for that team.
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event));
});

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

async function handleRequest(request, event) {
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (url.pathname.endsWith('/api/admin/players')) {
    if (request.method === 'GET') {
      const team = url.searchParams.get('team');
      if (!team) {
        return jsonResponse({ error: 'team query parameter required' }, 400);
      }
      const key = `players:${team.toUpperCase()}`;
      const stored = await event.env.PLAYERS_KV.get(key);
      const players = stored ? JSON.parse(stored) : [];
      return jsonResponse({ team: team.toUpperCase(), players });
    }

    if (request.method === 'POST') {
      let body;
      try {
        body = await request.json();
      } catch (err) {
        return jsonResponse({ error: 'invalid JSON' }, 400);
      }

      const team = (body.team || '').toString().toUpperCase();
      if (!team) return jsonResponse({ error: 'team is required' }, 400);

      const key = `players:${team}`;

      // If client sent an array of players, overwrite
      if (Array.isArray(body.players)) {
        await event.env.PLAYERS_KV.put(key, JSON.stringify(body.players));
        return jsonResponse({ ok: true, team, count: body.players.length });
      }

      // If client sent a single player, append
      if (body.player && typeof body.player === 'object') {
        const existing = await event.env.PLAYERS_KV.get(key);
        let arr = existing ? JSON.parse(existing) : [];
        arr.push(body.player);
        await event.env.PLAYERS_KV.put(key, JSON.stringify(arr));
        return jsonResponse({ ok: true, team, count: arr.length });
      }

      return jsonResponse({ error: 'invalid payload; send {team, players:[...]} or {team, player:{...}}' }, 400);
    }
  }

  return new Response('Not found', { status: 404 });
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
  });
}
