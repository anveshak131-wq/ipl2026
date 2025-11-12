# 🔑 Cloudflare Workers KV Setup Guide

## Overview

Cloudflare Workers KV is a distributed key-value store that allows you to persist data globally. This guide will help you set up KV to store your IPL Teams Manager data permanently.

---

## Step 1: Create a KV Namespace

### Option A: Via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**
   - Visit https://dash.cloudflare.com

2. **Go to Workers KV**
   - Left sidebar → Workers & Pages → KV Namespaces

3. **Create a Namespace**
   - Click **"Create a namespace"** button
   - Enter name: `IPL_TEAMS_DATA` (or your preferred name)
   - Click **"Create"**

4. **Note the Namespace ID**
   - You'll see something like: `abc123def456`
   - Save this ID (you'll need it later)

### Option B: Via Wrangler CLI

```bash
wrangler kv:namespace create "IPL_TEAMS_DATA"
wrangler kv:namespace create "IPL_TEAMS_DATA" --preview
```

---

## Step 2: Update wrangler.toml

Add KV bindings to your `wrangler.toml`:

```toml
# Cloudflare Pages Configuration for IPL Teams Manager v2
name = "ipl-teams-manager-v2"

[pages]
pages_build_output_dir = "."

# KV Namespace Bindings
[[kv_namespaces]]
binding = "KV_STORE"
id = "YOUR_NAMESPACE_ID_HERE"
preview_id = "YOUR_PREVIEW_NAMESPACE_ID_HERE"
```

**Replace:**
- `YOUR_NAMESPACE_ID_HERE` with your actual namespace ID
- `YOUR_PREVIEW_NAMESPACE_ID_HERE` with your preview namespace ID (if available)

---

## Step 3: Create a Cloudflare Worker

Workers act as the backend API to read/write to KV storage.

### Create File: `cloudflare/worker.ts`

```typescript
// Cloudflare Worker - IPL Teams Manager Backend
// Handles KV operations for data persistence

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // GET: Retrieve data
      if (request.method === 'GET' && path === '/api/teams') {
        const data = await env.KV_STORE.get('ipl_teams_data');
        
        if (!data) {
          return new Response(JSON.stringify({ error: 'No data found' }), {
            status: 404,
            headers: corsHeaders,
          });
        }

        return new Response(data, {
          status: 200,
          headers: corsHeaders,
        });
      }

      // POST: Save data
      if (request.method === 'POST' && path === '/api/teams') {
        const body = await request.text();
        
        // Store data in KV
        await env.KV_STORE.put('ipl_teams_data', body, {
          expirationTtl: 31536000, // 1 year
        });

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      // DELETE: Clear data
      if (request.method === 'DELETE' && path === '/api/teams') {
        await env.KV_STORE.delete('ipl_teams_data');
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: corsHeaders,
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Server error' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

interface Env {
  KV_STORE: KVNamespace;
}
```

---

## Step 4: Update DataManager to Use KV

Modify `js/data-manager.js` to sync with KV storage:

```javascript
class DataManager {
    constructor() {
        this.xmlDoc = null;
        this.kvEnabled = false;
        this.kvApiUrl = '/api/teams'; // Adjust if different
        this.initializeData();
    }

    /**
     * Initialize data - load from KV if available, otherwise use defaults
     */
    async initializeData() {
        try {
            // Try to load from KV storage
            const response = await fetch(this.kvApiUrl);
            
            if (response.ok) {
                const xmlString = await response.text();
                const parser = new DOMParser();
                this.xmlDoc = parser.parseFromString(xmlString, 'text/xml');
                this.kvEnabled = true;
                console.log('Loaded data from KV storage');
                return;
            }
        } catch (error) {
            console.log('KV storage not available, using in-memory data');
        }

        // Fallback to default in-memory data
        this.createDefaultData();
    }

    /**
     * Create default in-memory data
     */
    createDefaultData() {
        const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<ipl>
    <teams>
        <!-- Default teams data -->
    </teams>
</ipl>`;

        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xmlString, 'text/xml');
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
                console.log('Data saved to KV storage');
                return true;
            }
        } catch (error) {
            console.error('Failed to save to KV:', error);
        }

        return false;
    }

    /**
     * Add player (and save to KV)
     */
    async addPlayer(teamCode, playerData) {
        const result = this._addPlayerToXML(teamCode, playerData);
        
        if (result && this.kvEnabled) {
            await this.saveToKV();
        }

        return result;
    }

    // ... rest of methods remain the same
}
```

---

## Step 5: Enable Workers on Your Pages

1. **Go to Cloudflare Dashboard**
   - Workers & Pages → Pages → Your Project

2. **Set Custom Domain (if needed)**
   - Settings → Custom Domain → Add domain

3. **Create Route for API**
   - Go to Workers & Pages → Routes
   - Create route: `example.com/api/*` → Point to your worker

---

## Step 6: Deploy

### Deploy Pages with KV
```bash
# Install wrangler
npm install -D wrangler

# Deploy to Cloudflare Pages
npm run deploy
```

### Or via Git (Auto-deploy)
```bash
git add .
git commit -m "Add Workers KV storage"
git push origin main
```

---

## Testing KV Integration

### 1. Add a Player
```
Admin Panel → Players Tab → Add player
↓
App.js → DataManager.addPlayer()
↓
Data saved to KV ✅
```

### 2. Refresh Page
```
Player data PERSISTS ✅ (loaded from KV)
```

### 3. Export Data
```
Admin Panel → Export/Debug
→ Exports from KV storage
```

---

## KV API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/teams` | Retrieve all team data |
| POST | `/api/teams` | Save/update team data |
| DELETE | `/api/teams` | Clear all data |

---

## KV Namespace Structure

```
KV Namespace: IPL_TEAMS_DATA

Key: "ipl_teams_data"
Value: 
<?xml version="1.0"?>
<ipl>
    <teams>
        <team>
            <code>CSK</code>
            <name>Chennai Super Kings</name>
            <players>
                <player>
                    <name>Ruturaj Gaikwad</name>
                    ...
                </player>
            </players>
        </team>
        <!-- More teams -->
    </teams>
</ipl>
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on API call | Check worker route is configured |
| CORS errors | Ensure CORS headers in worker response |
| Data not persisting | Verify KV namespace is bound to worker |
| Empty data on refresh | Check KV_STORE binding in wrangler.toml |

---

## Benefits of KV Storage

✅ **Data Persists** - Across page refreshes and sessions
✅ **Global Distribution** - Data available worldwide
✅ **Automatic Backups** - Cloudflare handles redundancy
✅ **No Database Needed** - Simple key-value store
✅ **Free Tier** - 1000 operations/day free
✅ **Fast Access** - Cached globally

---

## Pricing

**Cloudflare Workers KV Free Tier:**
- 1,000 operations/day
- 100 MB storage
- Unlimited reads

**Paid Tier:**
- $0.50 per million operations
- $0.50 per GB stored

---

## Alternative: Simple localStorage (No Backend)

If you don't want to use KV, you can use browser localStorage:

```javascript
// Save to localStorage
localStorage.setItem('ipl_teams_data', xmlString);

// Load from localStorage
const savedData = localStorage.getItem('ipl_teams_data');
```

**Limitations:**
- 5-10MB per domain only
- Not synced across devices
- Lost if browser data cleared

---

## Next Steps

1. ✅ Create KV namespace
2. ✅ Update wrangler.toml
3. ✅ Create Cloudflare worker
4. ✅ Update DataManager
5. ✅ Deploy to Cloudflare
6. ✅ Test data persistence

---

**Ready to set up KV storage?** Start with Step 1! 🚀
