# 📍 Where to Add Environment Variables in Vercel

## ⚠️ Important: You're in the Wrong Place!

You're currently looking at **Team-level** Environment Variables. You need to add them at the **Project-level** instead.

---

## ✅ Correct Steps:

### Step 1: Go to Your Project (Not Team Settings)

1. **Click on your project name** in the top navigation or sidebar
   - Look for: **"ipl2026sportsup18"** or your project name
   - NOT "Team Settings" or "General"

2. **You should see your project dashboard** with:
   - Overview
   - Deployments
   - Analytics
   - Settings
   - etc.

### Step 2: Navigate to Project Settings

1. Click on **"Settings"** tab (in your project, not team)
2. In the left sidebar, click **"Environment Variables"**

### Step 3: Add Environment Variables

You'll see a page that says:
- **"Environment Variables"** (for this project)
- A form to add new variables
- A list of existing variables (if any)

**Add Variable 1:**
- **Key:** `UPSTASH_REDIS_REST_URL`
- **Value:** `https://joint-narwhal-21620.upstash.io`
- **Environments:** Check all three:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- Click **"Save"**

**Add Variable 2:**
- **Key:** `UPSTASH_REDIS_REST_TOKEN`
- **Value:** `AVR0AAIncDI4OGU2MTkyZDE3ZTU0MDJlOGJhNzZkMDhhYmIxYjYzMHAyMjE2MjA`
- **Environments:** Check all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- Click **"Save"**

---

## 🎯 Visual Guide:

```
Vercel Dashboard
  └── Your Project (ipl2026sportsup18) ← CLICK HERE
      └── Settings ← CLICK HERE
          └── Environment Variables ← CLICK HERE
              └── Add your variables here!
```

**NOT:**
```
Vercel Dashboard
  └── Team Settings ← You're here (WRONG!)
      └── Environment Variables ← This is for team-wide vars
```

---

## 🔍 How to Know You're in the Right Place:

**Project-level Environment Variables page shows:**
- ✅ Your project name at the top
- ✅ "Environment Variables" heading
- ✅ Form to add variables with "Key", "Value", and "Environments" checkboxes
- ✅ List of variables for THIS project only

**Team-level Environment Variables page shows:**
- ❌ "Team Settings" or "General" in navigation
- ❌ "Shared Environment Variables" text
- ❌ "Environment Variables added to the Team can be used by all Projects"
- ❌ "Link to Projects" option

---

## 📝 Quick Checklist:

- [ ] I'm in my PROJECT (not Team Settings)
- [ ] I clicked "Settings" in my project
- [ ] I clicked "Environment Variables" in the left sidebar
- [ ] I see a form to add variables
- [ ] I added `UPSTASH_REDIS_REST_URL`
- [ ] I added `UPSTASH_REDIS_REST_TOKEN`
- [ ] Both are enabled for Production, Preview, and Development
- [ ] I saved both variables
- [ ] I will redeploy after adding them

---

## 🚀 After Adding Variables:

1. **Redeploy your project:**
   - Go to **"Deployments"** tab
   - Click **"⋯"** on latest deployment
   - Click **"Redeploy"**
   - **UNCHECK** "Use existing Build Cache"
   - Click **"Redeploy"**

2. **Wait 2-3 minutes** for deployment

3. **Test:**
   ```
   https://ipl2026sportsup18.vercel.app/api/admin/players?team=RCB
   ```

---

## ❓ Still Can't Find It?

**Alternative Path:**
1. Go to: https://vercel.com/dashboard
2. Click on your project: **ipl2026sportsup18**
3. Click **"Settings"** (top navigation)
4. Click **"Environment Variables"** (left sidebar)

If you still see "Team Settings", you're in the wrong place. Make sure you clicked on your **PROJECT NAME** first!

