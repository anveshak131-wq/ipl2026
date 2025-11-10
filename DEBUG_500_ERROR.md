# 🔍 Debug 500 Error - Step by Step

## Step 1: Check Vercel Deployment Logs

The logs will show the exact error. Here's how:

1. **Go to Vercel Dashboard** → Your Project
2. **Click "Deployments"** tab
3. **Click on the latest deployment** (the most recent one)
4. **Click "Function Logs"** or **"Logs"** tab
5. **Look for errors** related to `/api/admin/players`

**What to look for:**
- Error messages about `UPSTASH_REDIS_REST_URL`
- Error messages about `UPSTASH_REDIS_REST_TOKEN`
- Any Redis connection errors
- Module import errors

**Copy the error message** and share it - that will tell us exactly what's wrong!

---

## Step 2: Verify Environment Variables Are Actually Set

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Verify both variables exist:**
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. **Check they're enabled for Production:**
   - Make sure the checkbox for **"Production"** is checked for both
4. **Check the values:**
   - `UPSTASH_REDIS_REST_URL` should be: `https://joint-narwhal-21620.upstash.io`
   - `UPSTASH_REDIS_REST_TOKEN` should start with: `AVR0AAInc...`

---

## Step 3: Make Sure You Redeployed AFTER Adding Variables

**Important:** Environment variables only work after a NEW deployment!

1. **Did you redeploy after adding the variables?**
   - If NO → You MUST redeploy!
   - If YES → Continue to Step 4

2. **To Redeploy:**
   - Go to **"Deployments"** tab
   - Click **"⋯"** on latest deployment
   - Click **"Redeploy"**
   - **UNCHECK** "Use existing Build Cache" (very important!)
   - Click **"Redeploy"**
   - Wait 2-3 minutes

---

## Step 4: Test the API with Better Error Messages

After redeployment, test the API again:
```
https://ipl2026sportsup18.vercel.app/api/admin/players?team=RCB
```

**If you still get 500 error:**
- The response should now include more details about what's wrong
- Look for `envVarsConfigured` in the JSON response
- This will tell us if the variables are being read

---

## Step 5: Check the Response Body

When you get a 500 error, **don't just look at the error page** - check the actual JSON response:

1. **Open browser Developer Tools** (F12)
2. **Go to "Network" tab**
3. **Reload the page** or make the API request
4. **Click on the failed request** (`/api/admin/players?team=RCB`)
5. **Click "Response" tab**
6. **Look at the JSON response** - it should have:
   ```json
   {
     "success": false,
     "error": "...",
     "hint": "...",
     "envVarsConfigured": {
       "UPSTASH_REDIS_REST_URL": true/false,
       "UPSTASH_REDIS_REST_TOKEN": true/false
     }
   }
   ```

**This will tell us:**
- If the environment variables are being read (`true` = good, `false` = not set)
- What the actual error is

---

## Common Issues:

### Issue 1: Variables Not Set for Production
**Fix:** Make sure both variables have **"Production"** checkbox checked

### Issue 2: Didn't Redeploy After Adding Variables
**Fix:** Redeploy without build cache

### Issue 3: Wrong Variable Names
**Fix:** Must be exactly:
- `UPSTASH_REDIS_REST_URL` (not `KV_REST_API_URL`)
- `UPSTASH_REDIS_REST_TOKEN` (not `KV_REST_API_TOKEN`)

### Issue 4: Variables Set at Team Level Instead of Project Level
**Fix:** Make sure you're in Project Settings, not Team Settings

### Issue 5: Package Not Installed
**Fix:** Make sure `@upstash/redis` is in `package.json` dependencies

---

## Quick Test:

Try this in your browser console (on the Vercel-deployed site):
```javascript
fetch('https://ipl2026sportsup18.vercel.app/api/admin/players?team=RCB')
  .then(r => r.json())
  .then(data => console.log(data))
```

This will show you the actual error message in the console.

---

## What to Share:

Please share:
1. **The error message from Vercel logs** (Step 1)
2. **The JSON response from the API** (Step 5)
3. **Whether you redeployed after adding variables** (Step 3)
4. **Screenshot of your Environment Variables page** (if possible)

This will help us identify the exact issue!

