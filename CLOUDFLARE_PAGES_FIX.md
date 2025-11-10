# 🔧 Fix Cloudflare Pages Build Error

## Problem
Cloudflare Pages build is failing because it's trying to install Vercel dependencies that aren't needed for static hosting.

## ✅ Solution: Update Cloudflare Pages Settings

### Option 1: Skip Build (Recommended for Static Sites)

1. Go to your Cloudflare Pages project
2. Click **Settings** → **Builds & deployments**
3. Update build settings:
   - **Build command**: (leave **EMPTY**)
   - **Build output directory**: `.` (dot/period)
   - **Root directory**: (leave empty)
   - **Node version**: (leave default or set to 18)

4. **Save** and **Retry deployment**

---

### Option 2: Use Minimal Build Command

If Cloudflare requires a build command:

1. **Build command**: `echo "Build complete"`
2. **Build output directory**: `.`
3. **Root directory**: (empty)

---

### Option 3: Remove Vercel Dependencies (Advanced)

If you want to clean up the dependencies:

1. **Temporarily rename** `package.json` to `package.json.backup`
2. **Create** a minimal `package.json`:
   ```json
   {
     "name": "ipl-cricket-hub",
     "version": "2.0.0",
     "scripts": {
       "build": "echo 'Build complete'"
     }
   }
   ```
3. **Deploy** again
4. **Rename back** if needed for Vercel

---

## 🎯 Recommended Settings

**For Cloudflare Pages Static Site:**

```
Framework preset: None
Build command: (empty)
Build output directory: .
Root directory: (empty)
Environment variables: (none needed)
```

---

## 📝 Why This Happens

- Cloudflare Pages tries to install all npm dependencies
- The `vercel` package in devDependencies isn't needed for static hosting
- For static sites, you don't need to install any dependencies
- The build should just copy files, not run npm install

---

## ✅ Quick Fix Steps

1. **Go to**: Cloudflare Dashboard → Your Project → Settings
2. **Find**: "Builds & deployments" section
3. **Change**: Build command to **EMPTY** (delete any text)
4. **Set**: Output directory to `.`
5. **Click**: "Save"
6. **Retry**: Click "Retry deployment"

---

## 🚀 Alternative: Use GitHub Pages Instead

If Cloudflare continues to have issues, **GitHub Pages** is simpler:

1. Go to: https://github.com/anveshak131-wq/ipl2026/settings/pages
2. Enable GitHub Pages
3. Done! No build configuration needed.

---

## Need Help?

The build error is likely because:
- Cloudflare is trying to install `vercel` package unnecessarily
- Solution: Skip the build or use empty build command

Your site is **static HTML/CSS/JS** - it doesn't need any build process!

