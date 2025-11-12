# 🔑 Workers KV - One Page Reference

## What is KV?
Cloudflare's global key-value store for persistent data storage.

## Your Problem
```
Add player → Refresh page → LOST ❌
```

## Solution
```
Add player → Saved to KV → Refresh page → SAVED ✅
```

---

## Quick Setup (30 min)

### 1. Create Namespace
```
https://dash.cloudflare.com
→ Workers KV Namespaces
→ Create "IPL_TEAMS_DATA"
→ Copy the ID
```

### 2. Update wrangler.toml
```toml
[[kv_namespaces]]
binding = "KV_STORE"
id = "YOUR_ID_HERE"
preview_id = "YOUR_PREVIEW_ID_HERE"
```

### 3. Deploy
```bash
npm install -D wrangler
wrangler login
wrangler deploy cloudflare/worker.ts
git push origin main
```

### 4. Test
Add player → Refresh → Data persists ✅

---

## Files You Have

| File | Purpose |
|------|---------|
| `js/data-manager-kv.js` | Use instead of data-manager.js |
| `cloudflare/worker.ts` | Backend API |
| `wrangler.kv.toml` | Config template |
| `KV_QUICK_START.md` | Full setup guide |

---

## API Endpoints

```
GET /api/teams → Get data
POST /api/teams → Save data
DELETE /api/teams → Clear data
GET /api/health → Check status
```

---

## Cost
- **Free tier**: 1,000 ops/day ✅
- **Your usage**: ~5 ops/day
- **Price**: FREE

---

## Key Features

✅ Auto-saves on player add
✅ Loads from KV on init
✅ Falls back to in-memory if KV down
✅ Global distribution
✅ No manual export needed

---

## Before → After

```
BEFORE (In-memory)
├─ Add player ✅
├─ Refresh ❌ LOST
└─ No persistence

AFTER (With KV)
├─ Add player ✅
├─ Auto-save to KV ✅
├─ Refresh ✅ Still there
└─ Data persists forever
```

---

## Monitoring

In browser console after adding player:
```
✅ Data saved to KV storage
```

If KV not working:
```
ℹ️ KV storage not available, using in-memory data
```

---

## Troubleshooting

| Issue | Check |
|-------|-------|
| Data not saving | Worker deployed? |
| API 404 | Worker route correct? |
| CORS error | Check worker headers |
| Data lost | Using data-manager-kv.js? |

---

## Do's ✅
- Create namespace first
- Update wrangler.toml with real IDs
- Deploy worker
- Replace data-manager.js
- Test after deployment

---

## Don'ts ❌
- Don't use old data-manager.js
- Don't forget to deploy worker
- Don't skip wrangler.toml update
- Don't use dummy IDs

---

## Documentation

| Doc | Read for |
|-----|----------|
| `KV_QUICK_START.md` | Quick setup |
| `WORKERS_KV_SETUP_DETAILED.md` | Full guide |
| `KV_BEFORE_AFTER.md` | Comparison |
| `KV_SETUP_CHECKLIST.md` | Step-by-step |

---

## Start Here
👉 **Read `KV_QUICK_START.md` now**

Then follow the 8 steps to complete setup.

---

**Expected time: 30 minutes**
**Difficulty: Easy**
**Result: Persistent data ✅**

Go! 🚀
