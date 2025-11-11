# Cloudflare Workers KV Setup for Player Uploads

Complete free setup using **Workers KV** to store player data.

## Why Workers KV?
- ✅ **100% FREE** — unlimited storage and API calls on free tier
- ✅ **Simple** — just key-value pairs
- ✅ **Fast** — global read replicas
- ✅ **Perfect for player data** — JSON objects stored with team as key

## Setup (5 minutes)

### Step 1: Install Wrangler (one time)

```bash
npm install -g wrangler
wrangler login
```

This connects your Cloudflare account to Wrangler.

### Step 2: Create a KV Namespace

```bash
wrangler kv:namespace create "players_kv"
```

Output will show:
```
 ✓ Created KV Namespace with ID: 1234567890abcdef
```

**Copy that ID** (you'll need it in step 3).

### Step 3: Setup Wrangler Config

Create/edit `wrangler.toml` in your repo root:

```toml
name = "player-storage-kv"
main = "./cloudflare/index.ts"
type = "javascript"
account_id = "YOUR_ACCOUNT_ID"
workers_dev = true
compatibility_date = "2025-11-11"

[[kv_namespaces]]
binding = "PLAYERS_KV"
id = "PASTE_THE_ID_FROM_STEP_2_HERE"
```

**Fill in:**
- `account_id`: From Cloudflare dashboard → Workers → Settings (copy Account ID)
- `id`: The namespace ID from step 2

### Step 4: Deploy the Worker

```bash
wrangler publish
```

Output will show your worker URL:
```
✓ Uploaded player-storage-kv
✓ Published to https://player-storage-kv.YOUR_ACCOUNT.workers.dev
```

**Copy that URL** (you'll use it in step 5).

### Step 5: Configure Admin Page

Edit `ipl2020/admin-upload.html` around line 384:

Find:
```javascript
window.CF_API_ENDPOINT = '';
```

Replace with:
```javascript
window.CF_API_ENDPOINT = 'https://player-storage-kv.YOUR_ACCOUNT.workers.dev/api/admin/players';
```

Save and deploy your static site.

### Step 6: Test It

1. Open admin page: `https://yoursite.com/admin-upload.html`
2. Add a player or upload CSV
3. Check browser console (F12) — you should see success message
4. Open another team page and the players should load from KV storage

## How It Works

- **POST /api/admin/players** with `{ team: "RCB", players: [...] }` → stores in KV with key `players:RCB`
- **GET /api/admin/players?team=RCB** → retrieves from KV
- Each team's player list is a single KV entry
- Data persists across page reloads and browser sessions

### Per-player statistics (persist across re-uploads)

- The Worker now maintains per-player statistics separately from the team list.
- Stats are stored under KV keys with the format: `stats:{TEAM}:{PLAYER_ID}`.
- PLAYER_ID is either `player.id` (if present) or a slug derived from the player's name (lowercase, non-alphanumerics replaced with underscores).
- When the admin re-uploads a player's list (POST with `players: [...]`), the Worker will:
  - Merge incoming player objects and attach any existing per-player stats from `stats:{TEAM}:{PLAYER_ID}` to each matching player.
  - Write the new players array to `players:{TEAM}` but will not delete any existing `stats:{...}` keys. This means stats persist even if an admin removes a player and later re-adds them.

### New endpoints for stats

- GET per-player stats:
  - URL: `/api/admin/player-stats?team=RCB&playerId=virat_kohli`
  - Response: `{ team: "RCB", playerId: "virat_kohli", stats: { ... } }`

- POST update per-player stats:
  - URL: `/api/admin/player-stats`
  - Body (JSON): `{ "team": "RCB", "playerId": "virat_kohli", "stats": { "runs": 1200, "matches": 45 } }`
  - Response: `{ ok: true, team: "RCB", playerId: "virat_kohli" }`

These endpoints let you update statistics independently of the player list upload flow (for example, when recording match results).

## Testing Endpoints (curl)

**Save players:**
```bash
curl -X POST 'https://player-storage-kv.YOUR_ACCOUNT.workers.dev/api/admin/players' \
  -H 'Content-Type: application/json' \
  -d '{
    "team": "RCB",
    "players": [
      {"name": "Virat Kohli", "role": "Batsman", "nationality": "Indian"},
      {"name": "Glenn Maxwell", "role": "All-rounder", "nationality": "Australian"}
    ]
  }'
```

**Retrieve players:**
```bash
curl 'https://player-storage-kv.YOUR_ACCOUNT.workers.dev/api/admin/players?team=RCB'
```

**Append a player:**
```bash
curl -X POST 'https://player-storage-kv.YOUR_ACCOUNT.workers.dev/api/admin/players' \
  -H 'Content-Type: application/json' \
  -d '{
    "team": "RCB",
    "player": {"name": "New Player", "role": "Bowler", "nationality": "Indian"}
  }'
```

## View Stored Data

In Cloudflare dashboard:
1. Go to Workers → KV
2. Click your namespace (`players_kv`)
3. You'll see keys like `players:RCB`, `players:MI`, etc.
4. Click a key to view the JSON data

## Cost: $0

- Free tier: **Unlimited API calls and storage** (up to 1GB per namespace)
- No charges, ever, for player data

## Troubleshooting

### Error: "KV namespace not found"
- Make sure the `id` in `wrangler.toml` matches the namespace ID from step 2
- Run `wrangler kv:namespace list` to confirm

### Error: "account_id is required"
- Go to Cloudflare dashboard → Workers → Settings
- Copy your Account ID and paste it in `wrangler.toml`

### 404 Not found
- Confirm the worker is deployed: `wrangler deployments list`
- Check the URL in `admin-upload.html` matches your worker subdomain exactly

### CORS errors in browser
- The worker includes CORS headers; check browser console for details
- If still blocked, the admin page and worker might be on different domains — let me know and I'll help

## What's Stored

For each team, one KV entry:
- **Key:** `players:RCB` (e.g., `players:MI`, `players:CSK`)
- **Value:** JSON array of player objects
  ```json
  [
    {"name": "Virat Kohli", "role": "Batsman", "age": 36, "nationality": "Indian", ...},
    {"name": "Glenn Maxwell", "role": "All-rounder", "age": 36, "nationality": "Australian", ...}
  ]
  ```

## Backup Your Data

Download all KV data:
```bash
wrangler kv:key list --binding PLAYERS_KV
```

Or manually via dashboard: Workers → KV → your namespace → select keys → export.

## Security

The example Worker has **no auth**. For production:

**Option 1: Cloudflare Access (Recommended)**
- Protect the worker with Cloudflare Access
- Gate by email/SSO
- No code changes

**Option 2: Add Secret Header**
- Update `cloudflare/index.ts` to check for header: `x-admin-token`
- Store token in worker secrets:
  ```bash
  wrangler secret put ADMIN_TOKEN
  ```
- Update admin page to send header in fetch

Ask if you want me to add auth.

## Next: Production Deployment

After testing locally:
1. Ensure `wrangler.toml` has no placeholders
2. Run `wrangler publish` from CI/CD (optional)
3. Admin page uses the Worker endpoint for all player uploads

---

**You're done!** Players are now stored in Cloudflare Workers KV. No cost, unlimited usage. 🎉
