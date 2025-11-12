# 🚀 Cloudflare Pages Build Configuration Guide

## For IPL Teams Manager v2

### Dashboard Settings (Exact Values)

**Framework preset:** 
```
None
```
*(No framework - static site)*

**Build command:** 
```
(leave empty or blank)
```
*(No build needed - files are already ready)*

**Build output directory:** 
```
/
```
*(Root directory - all files at top level)*

**Root directory (advanced):** 
```
(leave empty or default)
```
*(Not needed for this project)*

**Enable build comments:** 
```
✓ Check (optional - nice to have)
```
*(Adds deployment status to pull requests)*

---

## Why These Settings?

### ✅ Framework preset: **None**
- Your project is **pure static** (HTML + CSS + JS)
- No build tool needed (no Vite, Next.js, etc.)
- Files are ready to serve immediately

### ✅ Build command: **(empty)**
- No compilation step required
- No `npm run build` needed
- Static files don't need processing

### ✅ Build output directory: **/**
- Your `index.html` is at root: `/index.html` ✅
- Your CSS files are at: `/css/` ✅
- Your JS files are at: `/js/` ✅
- No subfolder nesting needed

### ✅ Root directory: **(empty)**
- Not needed - everything is already at root
- Leave blank/default

---

## Your Repository Structure

```
ipl2026 (root = /)
├── index.html           → Served as /index.html ✅
├── team.html            → Served as /team.html ✅
├── css/
│   ├── styles.css       → Served as /css/styles.css ✅
│   ├── teams.css
│   └── team-page.css
├── js/
│   ├── data-manager.js  → Served as /js/data-manager.js ✅
│   ├── ui-renderer.js
│   └── app.js
├── wrangler.toml
├── package.json
├── README.md
└── (other files)
```

**Build output directory `/` means:** "Serve all files from root directory"

---

## Step-by-Step Setup

### 1. Go to Cloudflare Dashboard
```
https://dash.cloudflare.com/
```

### 2. Navigate to Pages
```
Pages → Create a project → Connect to Git
```

### 3. Select Your Repository
```
Owner: anveshak131-wq
Repository: ipl2026
Branch: main
```

### 4. Fill in Build Settings

| Field | Value |
|-------|-------|
| **Framework preset** | None |
| **Build command** | (leave empty) |
| **Build output directory** | `/` |
| **Root directory** | (leave empty) |

### 5. Environment Variables (if needed)
```
(none required for this project)
```

### 6. Click "Save and Deploy"

---

## What Cloudflare Will Do

1. **Clone your GitHub repo** ✅
2. **Skip build step** (nothing to build) ✅
3. **Serve files from `/` directory** ✅
4. **Deploy to global CDN** ✅
5. **Give you live URL** ✅

---

## Expected Result

After deployment:
- `https://ipl-teams-manager.pages.dev/` → `index.html`
- `https://ipl-teams-manager.pages.dev/team.html` → `team.html`
- `https://ipl-teams-manager.pages.dev/css/styles.css` → `css/styles.css`
- `https://ipl-teams-manager.pages.dev/js/app.js` → `js/app.js`

All files served directly! 🎉

---

## Troubleshooting

### If you get "Output directory not found"
**Problem:** Build output directory is wrong
**Solution:** Set to `/` (root directory)

### If CSS/JS files don't load
**Problem:** Relative paths are incorrect
**Solution:** Verify URLs in `index.html` are correct:
```html
<link rel="stylesheet" href="/css/styles.css">
<script src="/js/app.js"></script>
```

### If deployment keeps failing
**Problem:** Build command or output directory misconfigured
**Solution:** 
- Build command: keep **empty**
- Build output: `/`
- Framework: **None**

---

## wrangler.toml (Optional)

You can also use `wrangler.toml` instead of dashboard:

```toml
name = "ipl-teams-manager-v2"

[pages]
pages_build_output_dir = "."

[build]
command = ""
directory = "."
```

**Note:** Dashboard settings override `wrangler.toml`, so use one or the other.

---

## ✅ Deployment Checklist

- [ ] Framework preset: **None**
- [ ] Build command: **(empty)**
- [ ] Build output directory: **/**
- [ ] Root directory: **(empty)**
- [ ] Repository connected to GitHub
- [ ] Branch set to **main**
- [ ] Save and Deploy clicked

After these settings, push to GitHub and deployment will trigger automatically! 🚀

---

**Your project is ready to deploy!** Just use these exact settings in Cloudflare Pages dashboard. ✨
