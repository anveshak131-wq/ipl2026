# Using Cloudflare R2 for Player Uploads

This guide walks you through storing player uploads in **Cloudflare R2** (object/file storage) instead of a database or KV.

## Why R2?
- **Simple**: Upload JSON files, retrieve them by team name
- **Cheap**: First 10GB/month is free
- **Durable**: Built-in backup and versioning
- **Fast**: Globally replicated
- **Archive-friendly**: Easy to download/export backup files

## Setup Steps

### 1. Create an R2 Bucket

**Via Dashboard:**
- Go to Cloudflare dashboard → R2 → Create bucket
- Name it `player-uploads` (or any name you like)
- Note the bucket name

**Via Wrangler (CLI):**
```bash
wrangler r2 bucket create player-uploads
```

### 2. Deploy the R2 Worker

The repo includes `cloudflare/worker-r2.ts` — a TypeScript Worker that:
- Accepts POST requests with player data
- Stores each team's players as `players/{TEAM}.json` in R2
- Serves GET requests to retrieve players by team

**Steps:**

1. Install Wrangler if you haven't:
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. Copy `wrangler-r2.toml` to `wrangler.toml` (or edit the existing one):
   ```bash
   cp wrangler-r2.toml wrangler.toml
   ```

3. Fill in your values:
   - **account_id**: Find in Cloudflare dashboard → Workers → Settings
   - **bucket_name**: The name you chose (default: `player-uploads`)

4. Publish:
   ```bash
   wrangler publish
   ```

   You'll get a worker URL like: `https://player-storage-r2.YOUR_ACCOUNT.workers.dev`

### 3. Wire Your Admin Page to R2

Edit `ipl2020/admin-upload.html`:

Find this line (around line 383):
```javascript
window.CF_API_ENDPOINT = '';
```

Replace with your Worker URL:
```javascript
window.CF_API_ENDPOINT = 'https://player-storage-r2.YOUR_ACCOUNT.workers.dev/api/admin/players';
```

Save and redeploy your static site (if needed).

### 4. Test the Upload

1. Open the admin page: `https://yoursite.com/admin-upload.html`
2. Add players manually or upload a CSV
3. Check the browser console (F12 → Console) for the response
4. You should see: `{ ok: true, team: "RCB", count: 11, message: "Stored 11 players..." }`

### 5. Verify Files in R2

Via Dashboard:
- Cloudflare → R2 → player-uploads bucket
- You'll see files like `players/RCB.json`, `players/MI.json`, etc.

Via CLI:
```bash
wrangler r2 object list player-uploads
```

### 6. Retrieve Players Programmatically

**Get RCB players:**
```bash
curl 'https://player-storage-r2.YOUR_ACCOUNT.workers.dev/api/admin/players?team=RCB'
```

**Response:**
```json
{
  "team": "RCB",
  "players": [
    { "name": "Virat Kohli", "role": "Batsman", ... },
    { "name": "Rajat Patidar", "role": "Batsman", ... }
  ]
}
```

## Uploading CSV Players

When you upload a CSV from the admin page:
1. The browser parses the CSV into a JSON array of player objects
2. Sends POST to your R2 Worker with `{ team: "RCB", players: [...] }`
3. Worker stores as `players/RCB.json` in R2
4. Next time someone visits, that team's player data is loaded from R2

## Adding Individual Players

If you add a single player via the manual entry form:
1. The Worker appends it to the existing array in R2
2. Uses POST with `{ team: "RCB", player: {...} }`
3. R2 file is updated with the new player list

## Backing Up Players

Players are stored as simple JSON files in R2. To back them up:

```bash
# Download all player files
wrangler r2 object download player-uploads/players/ ./backup/

# Or via Dashboard: select files → Download
```

## Security Notes

The example Worker has **no authentication**. For an admin endpoint, consider:

**Option A: Cloudflare Access (Recommended)**
- Protect the Worker URL with Cloudflare Access
- Gate access via email/SSO
- No code changes needed

**Option B: Add Secret Header Check**
- Update `worker-r2.ts` to check for `x-admin-token` header
- Store token in `wrangler secret put ADMIN_TOKEN`
- Update admin page to send the header

If you want me to add auth to the Worker, ask and I'll provide the code.

## Troubleshooting

**Error: "bucket_name not found"**
- Make sure the bucket name in `wrangler.toml` matches the actual bucket name
- Run `wrangler r2 bucket list` to see all buckets

**Worker returns 404**
- Confirm the worker is deployed: `wrangler deployments list`
- Check the URL format in `admin-upload.html` matches your worker subdomain

**Players not persisting**
- Check R2 bucket permissions (Settings → R2 API Tokens, ensure your credentials have write access)
- Check browser console for errors

**CORS errors**
- The Worker includes CORS headers for all origins (`*`). If still blocked, check your domain's CORS policy.

## Cost Estimate

- **Free tier**: 10GB/month storage, unlimited read/write requests (first 3 million requests/month free)
- **Typical use**: Player uploads are tiny JSON files (~1-10KB per team), so you'll stay well under free limits

## Next Steps

- If you want to also upload **player photos** (images), update the Worker to store images in R2 too
- If you want **versioning/history**, use R2's versioning feature
- If you want **public links** to downloads, generate signed URLs in the Worker

---

Questions? Check `cloudflare/worker-r2.ts` comments or ask!
