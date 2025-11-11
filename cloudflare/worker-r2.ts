// Cloudflare Worker with R2 storage for player uploads
// Stores player data as JSON files in R2 bucket
// 
// Setup:
//   1. Create an R2 bucket (e.g., "player-uploads")
//   2. In wrangler.toml, bind it as: [[r2_buckets]] binding = "PLAYER_BUCKET" bucket_name = "player-uploads"
//   3. Set account_id and other values in wrangler.toml
//   4. Run: wrangler publish

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export default {
  async fetch(request: Request, env: any, ctx: any) {
    const url = new URL(request.url);

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Health check
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response('Player storage (R2) worker', { status: 200, headers: CORS_HEADERS });
    }

    if (url.pathname.endsWith('/api/admin/players')) {
      if (request.method === 'GET') {
        const team = url.searchParams.get('team');
        if (!team) return jsonResponse({ error: 'team query parameter required' }, 400);

        const key = `players/${team.toUpperCase()}.json`;
        try {
          const obj = await env.PLAYER_BUCKET.get(key);
          if (!obj) {
            return jsonResponse({ team: team.toUpperCase(), players: [] });
          }
          const text = await obj.text();
          const players = JSON.parse(text);
          return jsonResponse({ team: team.toUpperCase(), players });
        } catch (err: any) {
          return jsonResponse({ team: team.toUpperCase(), players: [], error: err?.message || 'unknown error' }, 200);
        }
      }

      if (request.method === 'POST') {
        let body: any;
        try {
          body = await request.json();
        } catch (err) {
          return jsonResponse({ error: 'invalid JSON' }, 400);
        }

        const team = (body.team || '').toString().toUpperCase();
        if (!team) return jsonResponse({ error: 'team is required' }, 400);

        const key = `players/${team}.json`;

        // Overwrite with array of players
        if (Array.isArray(body.players)) {
          await env.PLAYER_BUCKET.put(key, JSON.stringify(body.players, null, 2), {
            httpMetadata: { contentType: 'application/json' }
          });
          return jsonResponse({
            ok: true,
            team,
            count: body.players.length,
            message: `Stored ${body.players.length} players for ${team} in R2`
          });
        }

        // Append single player
        if (body.player && typeof body.player === 'object') {
          try {
            const obj = await env.PLAYER_BUCKET.get(key);
            let arr: any[] = [];
            if (obj) {
              const text = await obj.text();
              arr = JSON.parse(text);
            }
            arr.push(body.player);
            await env.PLAYER_BUCKET.put(key, JSON.stringify(arr, null, 2), {
              httpMetadata: { contentType: 'application/json' }
            });
            return jsonResponse({
              ok: true,
              team,
              count: arr.length,
              message: `Appended 1 player; ${team} now has ${arr.length} players`
            });
          } catch (err: any) {
            return jsonResponse({ error: `Failed to append: ${err?.message || 'unknown error'}` }, 500);
          }
        }

        return jsonResponse({
          error: 'invalid payload; send {team, players:[...]} or {team, player:{...}}'
        }, 400);
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
