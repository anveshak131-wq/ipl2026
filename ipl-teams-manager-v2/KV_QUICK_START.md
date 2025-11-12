# ⚡ Workers KV Setup - Quick Steps

## Overview
This guide will enable permanent data storage using Cloudflare Workers KV.

---

## Step 1: Create KV Namespace (5 min)

### Via Cloudflare Dashboard:
1. Go https://dash.cloudflare.com
2. Workers & Pages → KV Namespaces
3. Click **"Create a namespace"**
4. Name: `IPL_TEAMS_DATA`
5. Click **"Create"**
6. **Copy the Namespace ID** (you'll need it)

---

## Step 2: Update wrangler.toml

Replace your `wrangler.toml` with:

```toml
name = "ipl-teams-manager-v2"

[pages]
pages_build_output_dir = "."

[[kv_namespaces]]
binding = "KV_STORE"
id = "YOUR_NAMESPACE_ID_HERE"
preview_id = "YOUR_PREVIEW_NAMESPACE_ID_HERE"
```

**Replace:**
- `YOUR_NAMESPACE_ID_HERE` → Your actual namespace ID from Step 1
- `YOUR_PREVIEW_NAMESPACE_ID_HERE` → Preview ID (if available)

---

## Step 3: Files Already Created

The following files are ready in your project:

✅ `cloudflare/worker.ts` - Backend worker with KV API
✅ `js/data-manager-kv.js` - Updated DataManager with KV support

---

## Step 4: Choose Implementation

### Option A: Replace Current DataManager (Recommended)

```bash
# Backup original
cp js/data-manager.js js/data-manager.backup.js

# Use KV version
cp js/data-manager-kv.js js/data-manager.js
```

### Option B: Keep Both (For Testing)

Use `js/data-manager-kv.js` as alternative.

---

## Step 5: Deploy Worker

```bash
# Install dependencies
npm install -D wrangler @cloudflare/workers-types

# Login to Cloudflare
wrangler login

# Deploy worker
wrangler deploy cloudflare/worker.ts
```

---

## Step 6: Connect to Pages

1. **Cloudflare Dashboard** → Pages → Your Project
2. **Settings** → Functions
3. **Production** → Enable Functions
4. **Add KV Binding**
   - Variable: `KV_STORE`
   - Namespace: `IPL_TEAMS_DATA`
5. **Save**

---

## Step 7: Update API URL (if needed)

If your worker URL is different, update in `js/data-manager-kv.js`:

```javascript
this.kvApiUrl = 'https://your-worker-url.dev/api/teams';
```

Or if on same domain:
```javascript
this.kvApiUrl = '/api/teams';
```

---

## Step 8: Deploy & Test

```bash
git add .
git commit -m "Add Workers KV storage"
git push origin main
```

**Wait 5-10 minutes for deployment.**

---

## Test It Works

1. Go to https://sportsup18.pages.dev/
2. **Admin Panel** → Add a player to RCB
3. **Refresh page** ← Player should STILL BE THERE ✅
4. **Close & reopen browser** ← Player still there ✅

---

## API Endpoints

```
GET /api/teams
  → Retrieve all data from KV

POST /api/teams
  → Save/update data to KV

DELETE /api/teams
  → Clear all data from KV

GET /api/health
  → Check if worker is running
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on API | Check worker deployment |
| CORS error | Worker includes CORS headers |
| Data not saving | Check KV namespace binding |
| Data lost on refresh | Make sure using data-manager-kv.js |

---

## Pricing

**Free Tier:**
- 1,000 operations/day
- 100 MB storage
- Unlimited reads

**Your usage:** ~10 operations/day (typical)

---

## What's Different?

### Before (In-Memory Only)
```
Add player → Stored in browser RAM → Refresh → LOST ❌
```

### After (With KV)
```
Add player → Stored in KV globally → Refresh → SAVED ✅
```

---

**Ready? Follow the steps above!** 🚀
