# ✅ Quick Setup: Add Environment Variables to Vercel

## Your Upstash Redis Credentials

From your Upstash dashboard, you have:
- **URL**: `https://joint-narwhal-21620.upstash.io`
- **Token**: `AVR0AAIncDI4OGU2MTkyZDE3ZTU0MDJlOGJhNzZkMDhhYmIxYjYzMHAyMjE2MjA`

## ⚠️ Important: Variable Names

Upstash shows `KV_REST_API_URL` and `KV_REST_API_TOKEN`, but you need to use:
- `UPSTASH_REDIS_REST_URL` (not `KV_REST_API_URL`)
- `UPSTASH_REDIS_REST_TOKEN` (not `KV_REST_API_TOKEN`)

The `@upstash/redis` SDK looks for variables with `UPSTASH_REDIS_` prefix!

---

## Step-by-Step: Add to Vercel

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: **ipl2026sportsup18**

### 2. Navigate to Environment Variables
- Click **"Settings"** tab (top navigation)
- Click **"Environment Variables"** (left sidebar)

### 3. Add First Variable

**Variable Name:** `UPSTASH_REDIS_REST_URL`

**Value:** `https://joint-narwhal-21620.upstash.io`

**Environments:** ✅ Production, ✅ Preview, ✅ Development (check all three)

Click **"Save"**

### 4. Add Second Variable

**Variable Name:** `UPSTASH_REDIS_REST_TOKEN`

**Value:** `AVR0AAIncDI4OGU2MTkyZDE3ZTU0MDJlOGJhNzZkMDhhYmIxYjYzMHAyMjE2MjA`

**Environments:** ✅ Production, ✅ Preview, ✅ Development (check all three)

Click **"Save"**

### 5. Redeploy (CRITICAL!)

After adding variables, you MUST redeploy:

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"⋯"** (three dots menu)
4. Click **"Redeploy"**
5. ⚠️ **UNCHECK** "Use existing Build Cache" (important!)
6. Click **"Redeploy"**

Wait 2-3 minutes for deployment to complete.

---

## Verify It Works

After redeployment, test:

1. **API Test:**
   ```
   https://ipl2026sportsup18.vercel.app/api/admin/players?team=RCB
   ```
   Should return: `{"success": true, "data": [], "count": 0}` (NOT 500 error!)

2. **RCB Page:**
   ```
   https://ipl2026sportsup18.vercel.app/rcb
   ```
   Should show "0 Players" (NOT "Error loading players")

3. **Admin Stats:**
   ```
   https://ipl2026sportsup18.vercel.app/admin-player-stats
   ```
   Should show "No Players Found" (NOT 500 errors)

---

## Summary

✅ Add `UPSTASH_REDIS_REST_URL` = `https://joint-narwhal-21620.upstash.io`
✅ Add `UPSTASH_REDIS_REST_TOKEN` = `AVR0AAIncDI4OGU2MTkyZDE3ZTU0MDJlOGJhNzZkMDhhYmIxYjYzMHAyMjE2MjA`
✅ Enable for all environments (Production, Preview, Development)
✅ Redeploy WITHOUT build cache
✅ Wait 2-3 minutes
✅ Test the API

That's it! 🎉

