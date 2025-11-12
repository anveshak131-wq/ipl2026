# 🛠️ Installation & Setup Guide

## Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge - latest versions)
- Python 3.x OR Node.js 14+
- Git (for version control)
- GitHub account (for deployment)
- Cloudflare account (optional, for free hosting)

## Step-by-Step Installation

### 1. Clone or Download the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/yourusername/ipl-teams-manager-v2.git
cd ipl-teams-manager-v2
```

**Option B: Download ZIP**
1. Click "Code" → "Download ZIP"
2. Extract to your desired location
3. Open terminal in that folder

### 2. Run Locally

**Option A: Python (Recommended)**
```bash
# Navigate to project directory
cd /path/to/ipl-teams-manager-v2

# Start HTTP server
python -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

**Option B: Node.js**
```bash
# Install http-server globally (first time only)
npm install -g http-server

# Start server in project directory
cd /path/to/ipl-teams-manager-v2
http-server .

# Open in browser
# Visit: http://localhost:8080
```

**Option C: Live Server (VS Code Extension)**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Browser opens automatically

### 3. Verify Installation

Check that you can:
- [ ] See homepage with 10 team cards
- [ ] Click a team to see detail page
- [ ] Click "Admin" link (top right)
- [ ] See password prompt
- [ ] Enter `admin2025` to access admin panel

### 4. Customize (Optional)

#### Change Admin Password
Edit `js/app.js`, around line 24:
```javascript
this.adminPassword = 'your-new-password';
```

#### Change Theme Colors
Edit `css/styles.css`:
```css
:root {
    --color-secondary: #6366f1;  /* Change this */
    --color-accent: #ec4899;      /* Or this */
}
```

## Deployment

### Deploy to Cloudflare Pages (Easiest)

#### Prerequisites
- GitHub account (with repository)
- Cloudflare account (free)

#### Step 1: Push to GitHub
```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: IPL Teams Manager v2"
git branch -M main
git remote add origin https://github.com/yourusername/ipl-teams-manager-v2.git
git push -u origin main
```

#### Step 2: Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pages → Create a project
3. Connect to GitHub
4. Select your repository
5. **Build Settings:**
   - Framework: (leave as None)
   - Build command: (leave empty)
   - Build output directory: `.` (root)
6. Click "Save and Deploy"

#### Step 3: Configure GitHub Secrets (for CI/CD)
1. Go to GitHub repo → Settings → Secrets → New repository secret
2. Add `CLOUDFLARE_API_TOKEN`:
   - Get from Cloudflare: Settings → API Tokens → Create Token
3. Add `CLOUDFLARE_ACCOUNT_ID`:
   - Found in URL: `https://dash.cloudflare.com/ACCOUNT_ID`
4. Save secrets

#### Step 4: Deploy
```bash
# Just push your code!
git push origin main

# GitHub Actions automatically deploys to Cloudflare Pages
# Check deployment status in Actions tab
```

**Your site is live at:** `https://ipl-teams-manager.pages.dev`

### Deploy to Netlify

#### Prerequisites
- GitHub account
- Netlify account (free)

#### Steps
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Select GitHub repository
4. Build settings:
   - Build command: (leave empty)
   - Publish directory: `.`
5. Deploy!

**Your site is live at:** `https://ipl-teams-manager.netlify.app`

### Deploy to Vercel

#### Steps
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   cd /path/to/project
   vercel --prod
   ```
3. Follow prompts

**Your site is live at:** `https://ipl-teams-manager.vercel.app`

### Deploy to GitHub Pages

#### Steps
1. Go to repo → Settings → Pages
2. Under "Source", select `main` branch
3. Click "Save"
4. Site is live at: `https://yourusername.github.io/ipl-teams-manager-v2/`

---

## Verification Checklist

### Local Testing
- [ ] Server starts without errors
- [ ] Homepage loads in browser
- [ ] All 10 team cards display
- [ ] Team cards have correct colors
- [ ] Admin link is in navbar
- [ ] Admin password works
- [ ] Can add players
- [ ] Player stats show correctly
- [ ] Can export data
- [ ] Mobile responsive (resize browser)

### Production Testing
- [ ] Site loads on live domain
- [ ] Page speed is fast (<2s)
- [ ] Admin panel works
- [ ] No 404 errors
- [ ] Mobile looks good
- [ ] Data persists within session
- [ ] Export downloads file

---

## Troubleshooting

### Server won't start

**Issue:** "Address already in use"
```bash
# Python: kill process on port 8000
# Or use different port
python -m http.server 9000
```

### Files not found errors (404)

**Solution:**
1. Check file paths are relative (not absolute)
2. Verify file names match exactly (case-sensitive)
3. Reload browser (Ctrl+Shift+R for hard refresh)

### Admin password not working

**Solution:**
1. Check caps lock
2. Verify password is `admin2025`
3. Check `js/app.js` line 24 for actual password

### CSS/JS not loading

**Solution:**
1. Open DevTools (F12)
2. Check Network tab for failed requests
3. Verify file paths in HTML
4. Check console for errors

### Data not saving

**Note:** Data is intentionally in-memory only!
- Refresh page = data is lost
- This is by design
- To persist, export to JSON/XML first

### Deployment fails

**Check:**
1. GitHub secrets are set correctly
2. Repository is public
3. Files are committed to `main` branch
4. No build errors in Actions tab

---

## File Structure Verification

After installation, your folder should look like:

```
ipl-teams-manager-v2/
├── index.html           ✅
├── team.html            ✅
├── package.json         ✅
├── wrangler.toml        ✅
├── .gitignore           ✅
├── .github/
│   └── workflows/
│       └── deploy.yml   ✅
├── css/
│   ├── styles.css       ✅
│   ├── teams.css        ✅
│   └── team-page.css    ✅
├── js/
│   ├── app.js           ✅
│   ├── data-manager.js  ✅
│   └── ui-renderer.js   ✅
└── (Documentation files)
    ├── README.md        ✅
    ├── DEVELOPER.md     ✅
    ├── QUICKSTART.md    ✅
    └── PROJECT_STATUS.md ✅
```

All files present? You're ready to go! ✨

---

## Quick Command Reference

### Local Development
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server .

# VS Code Live Server
Right-click index.html → Open with Live Server
```

### Git Commands
```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <url>
git push -u origin main

# Regular updates
git add .
git commit -m "Description of changes"
git push origin main
```

### NPM Commands
```bash
# Install dependencies (if any)
npm install

# Start local server
npm start

# Deploy (after setup)
npm run deploy
```

---

## Support

### Documentation
- 📖 README.md - Full user guide
- 👨‍💻 DEVELOPER.md - Technical reference
- 🚀 QUICKSTART.md - Quick start guide
- 📊 PROJECT_STATUS.md - Project metrics

### Getting Help
1. Check documentation files
2. Review browser console (F12) for errors
3. Check GitHub Issues
4. Create new GitHub Issue with:
   - Error message
   - Steps to reproduce
   - Browser/OS info

---

## Success! 🎉

You've successfully installed IPL Teams Manager v2!

### What's Next?
1. Add some players via admin panel
2. Export your data
3. Deploy to live server
4. Share with friends!

**Enjoy!** ⚡🏏
