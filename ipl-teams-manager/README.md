# 🏏 IPL Teams Manager

A **production-ready**, **static web application** for managing IPL teams and players. Built with vanilla HTML5, CSS3, and JavaScript ES6+ with **in-memory XML data management** using `DOMParser` and `XMLSerializer`.

## ✨ Features

- ✅ **No Backend Required** — Fully static, deployable on any CDN
- ✅ **No Build Tools** — Pure HTML, CSS, JavaScript
- ✅ **In-Memory XML Data** — Uses JavaScript DOMParser for CRUD operations
- ✅ **No Persistence** — All data lost on page reload (as required)
- ✅ **Responsive Design** — Mobile-first, works on all devices
- ✅ **Modern UI** — Gradients, cards, hover effects, accessible
- ✅ **10 IPL Teams** — Pre-configured teams (MI, CSK, RCB, etc.)
- ✅ **Admin Panel** — Add/edit/delete players from any team
- ✅ **GitHub Actions CI/CD** — Auto-deploy to Cloudflare Pages on push

## 📁 Project Structure

```
ipl-teams-manager/
├── index.html              # Home page with teams grid
├── team.html               # Individual team page (views players)
├── admin.html              # Admin panel (manage players)
├── styles.css              # Global styles (gradients, responsive)
├── js/
│   ├── app.js              # App initialization
│   └── data-manager.js     # In-memory XML data CRUD
├── wrangler.toml           # Cloudflare Pages config
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions auto-deploy
└── README.md               # This file
```

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ipl-teams-manager
   ```

2. **Serve locally (Python):**
   ```bash
   python3 -m http.server 8000
   ```
   Then open: `http://localhost:8000`

3. **Or serve with Node:**
   ```bash
   npx http-server
   ```

### Pages & Features

#### 🏠 **Home** (`index.html`)
- Grid of all 10 IPL teams
- Team cards with player count
- Links to team pages and admin panel

#### 🏟️ **Team Page** (`team.html?code=RCB`)
- Team name and details
- List of players in that team
- Back link to home

#### 🔧 **Admin Panel** (`admin.html`)
- Select a team from sidebar
- Add new players (name, role, jersey)
- Delete players
- Live updates (no page reload)
- All changes lost on refresh

## 💾 Data Management

### In-Memory XML Structure

Data is stored entirely in-memory using XML:

```xml
<ipl>
  <teams>
    <team>
      <code>RCB</code>
      <name>Royal Challengers Bangalore</name>
      <players>
        <player>
          <name>Virat Kohli</name>
          <role>Batsman</role>
          <jersey>18</jersey>
        </player>
      </players>
    </team>
  </teams>
</ipl>
```

### `DataManager` Class (JS)

Located in `js/data-manager.js`:

- `getAllTeams()` — Get all team metadata
- `getTeam(code)` — Get a specific team
- `getTeamPlayers(code)` — Get players for a team
- `addPlayer(code, player)` — Add a player to a team
- `deletePlayer(code, index)` — Remove a player
- `exportXML()` — Export current XML string (for debugging)
- `debugLog()` — Log all data to console

**No methods persist to localStorage, sessionStorage, or any backend.**

## 🎨 Design Highlights

### CSS Features
- **Gradients** — Linear gradients on navbar, hero sections
- **Flexbox** — Navigation, buttons, layouts
- **Grid** — Teams grid, players grid, admin layout
- **Responsive** — Mobile-first, breakpoints at 768px and 480px
- **Hover Effects** — Cards lift, buttons scale, smooth transitions
- **Accessibility** — Semantic HTML, color contrast, reduced-motion support

### Color Scheme
- Primary: `#1f2937` (Dark gray)
- Secondary: `#3b82f6` (Blue)
- Accent: `#f97316` (Orange)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)

## 🔌 Deployment

### Deploy to Cloudflare Pages

#### Option 1: GitHub Actions (Auto-Deploy)

1. **Set up GitHub Secrets:**
   - Go to Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN` (from Cloudflare dashboard)
   - Add `CLOUDFLARE_ACCOUNT_ID` (from your Cloudflare account)

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy IPL Teams Manager"
   git push origin main
   ```

   The workflow in `.github/workflows/deploy.yml` will automatically deploy.

#### Option 2: Manual Deployment

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate:**
   ```bash
   wrangler login
   ```

3. **Deploy:**
   ```bash
   wrangler pages deploy ipl-teams-manager --project-name ipl-teams-manager
   ```

Your site will be live at: `https://ipl-teams-manager.<account>.pages.dev`

## 📦 No External Dependencies

This project uses **ZERO external libraries** or build tools:
- ✅ No React, Vue, Angular
- ✅ No jQuery, Lodash
- ✅ No npm packages (optional for local dev only)
- ✅ No webpack, Vite, Babel
- ✅ Pure vanilla JavaScript (ES6+)
- ✅ XML via browser's native DOMParser

## 🔄 Data Flow

1. **Page loads** → `DataManager` initializes XML in memory
2. **User adds player** → `addPlayer()` creates XML element
3. **Admin deletes player** → `deletePlayer()` removes XML element
4. **Page reloads** → All data is lost (new XML initialized)

**No persistence layer intentionally.**

## 🧪 Testing

### Manual Testing

1. **Home Page:**
   - Open `index.html`
   - Verify 10 team cards render
   - Click a team card → should navigate to team page

2. **Team Page:**
   - Open `team.html?code=RCB`
   - Verify team name displays
   - Player count should be 0 initially (empty state message)

3. **Admin Panel:**
   - Open `admin.html`
   - Select a team from the sidebar
   - Add a player (name, role, jersey)
   - Verify player appears in list
   - Delete player → should remove from list
   - Refresh page → all data gone (expected!)

### Console Debugging

In browser DevTools → Console:

```javascript
// Access the DataManager
const dm = new DataManager();

// Log all data
dm.debugLog();

// Export XML
console.log(dm.exportXML());

// Get specific team
console.log(dm.getTeam('RCB'));
```

## 📝 Code Comments

All files are fully commented for clarity:
- `index.html` — Page structure and team grid logic
- `team.html` — Team details and player display
- `admin.html` — Admin UI and form handling
- `styles.css` — Section-by-section CSS organization
- `js/data-manager.js` — Detailed method documentation
- `js/app.js` — App initialization and utilities

## ♿ Accessibility

- Semantic HTML5 tags
- Sufficient color contrast (WCAG AA)
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text ready for future images
- `prefers-reduced-motion` media query

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

MIT License — Use freely in personal and commercial projects.

## 🙏 Credits

Built as a production-ready example of vanilla JavaScript with modern web standards.

---

**Built with ❤️ | No frameworks, no fuss, just code.**
