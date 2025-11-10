# 🚀 Fix 500 Errors - Upstash Redis Setup in Vercel

## Problem
All API endpoints are returning 500 errors because Upstash Redis environment variables are not configured in Vercel.

## Solution
You need to add Upstash Redis environment variables to your Vercel project and redeploy.

---

## Step-by-Step Instructions

### Step 1: Get Your Upstash Redis Credentials

1. Go to your **Upstash Dashboard**: https://console.upstash.com/
2. Select your Redis database: **ipl-data** (or whatever you named it)
3. Click on **"REST API"** tab
4. You'll see:
   - **UPSTASH_REDIS_REST_URL** - Copy this URL
   - **UPSTASH_REDIS_REST_TOKEN** - Copy this token

### Step 2: Add Environment Variables in Vercel

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: **ipl2026sportsup18** (or your project name)
3. Click on **"Settings"** tab (top navigation)
4. Click on **"Environment Variables"** (left sidebar)
5. Add these two variables:

   **Variable 1:**
   - **Name**: `UPSTASH_REDIS_REST_URL`
   - **Value**: (Paste the URL from Upstash)
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
   - Click **"Save"**

   **Variable 2:**
   - **Name**: `UPSTASH_REDIS_REST_TOKEN`
   - **Value**: (Paste the token from Upstash)
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
   - Click **"Save"**

### Step 3: Redeploy Your Application

After adding the environment variables, you **MUST** redeploy:

**Option A: Redeploy from Vercel Dashboard (Easiest)**
1. Go to your project's **"Deployments"** tab
2. Find the latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Make sure **"Use existing Build Cache"** is **UNCHECKED** (to ensure new env vars are loaded)
6. Click **"Redeploy"**

**Option B: Push a New Commit (Alternative)**
1. Make a small change to any file (or just add a comment)
2. Commit and push to your repository
3. Vercel will automatically redeploy

### Step 4: Verify the Fix

After redeployment (wait 1-2 minutes):

1. **Test the API directly:**
   ```
   https://ipl2026sportsup18.vercel.app/api/admin/players?team=RCB
   ```
   Should return:
   ```json
   {
     "success": true,
     "data": [],
     "count": 0
   }
   ```
   (Not a 500 error!)

2. **Check your pages:**
   - Go to: `https://ipl2026sportsup18.vercel.app/rcb`
   - Should show "0 Players" (not "Error loading players")
   - Go to: `https://ipl2026sportsup18.vercel.app/admin-player-stats`
   - Should show "No Players Found" (not 500 errors for all teams)

---

## Troubleshooting

### Still Getting 500 Errors?

1. **Check Environment Variables:**
   - Go to Vercel → Settings → Environment Variables
   - Verify both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` exist
   - Make sure they're enabled for **Production** environment

2. **Check Deployment Logs:**
   - Go to Vercel → Deployments → Latest deployment
   - Click on the deployment
   - Check "Function Logs" for any errors
   - Look for messages about missing environment variables

3. **Verify Upstash Redis is Active:**
   - Go to Upstash Dashboard
   - Check that your Redis database status is **"Active"**
   - Test the connection from Upstash dashboard

4. **Clear Browser Cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

### Environment Variables Not Working?

If environment variables aren't being picked up:

1. **Redeploy WITHOUT build cache:**
   - In Vercel deployment settings, uncheck "Use existing Build Cache"
   - This forces a fresh build with new environment variables

2. **Check Variable Names:**
   - Must be exactly: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
   - Case-sensitive, no extra spaces

3. **Wait for Deployment:**
   - Environment variables are only available after a new deployment
   - Wait 2-3 minutes after adding variables before testing

---

## Quick Checklist

- [ ] Got credentials from Upstash Dashboard
- [ ] Added `UPSTASH_REDIS_REST_URL` to Vercel Environment Variables
- [ ] Added `UPSTASH_REDIS_REST_TOKEN` to Vercel Environment Variables
- [ ] Enabled variables for Production, Preview, and Development
- [ ] Redeployed the application (without build cache)
- [ ] Waited 2-3 minutes for deployment to complete
- [ ] Tested API endpoint - should return 200, not 500
- [ ] Tested RCB page - should show "0 Players", not error
- [ ] Tested admin-player-stats - should show "No Players Found", not 500 errors

---

## What Changed?

The code now uses `@upstash/redis` which requires these environment variables:
- `UPSTASH_REDIS_REST_URL` - Your Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN` - Your Upstash Redis REST API token

These are automatically read by `Redis.fromEnv()` when the variables are set in Vercel.

---

## Need Help?

If you're still having issues:
1. Check Vercel deployment logs for specific error messages
2. Verify the Upstash Redis database is active and accessible
3. Make sure you copied the full URL and token (no extra spaces)

