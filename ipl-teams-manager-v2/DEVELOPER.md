# IPL Teams Manager v2 - Developer Guide

## Quick Reference

### File Structure at a Glance

```
ipl-teams-manager-v2/
├── index.html              # Main page - view all teams
├── team.html               # Team detail page
├── css/
│   ├── styles.css          # Global styles + base components (620 lines)
│   ├── teams.css           # Teams cards + responsive design (480 lines)
│   └── team-page.css       # Team detail page styles (110 lines)
├── js/
│   ├── data-manager.js     # In-memory XML CRUD (320 lines)
│   ├── ui-renderer.js      # DOM rendering utilities (250 lines)
│   └── app.js              # App init + event handlers (380 lines)
├── .github/workflows/deploy.yml    # GitHub Actions CI/CD
├── wrangler.toml           # Cloudflare config
├── package.json            # Dependencies
└── README.md               # Full documentation
```

### 10 IPL Teams

All configured in `DataManager.initializeData()`:

1. **MI** (Mumbai Indians) - Blue
2. **CSK** (Chennai Super Kings) - Gold
3. **RCB** (Royal Challengers Bangalore) - Red
4. **KKR** (Kolkata Knight Riders) - Purple
5. **DC** (Delhi Capitals) - Teal
6. **SRH** (Sunrisers Hyderabad) - Orange
7. **RR** (Rajasthan Royals) - Pink
8. **PBKS** (Punjab Kings) - Red-Orange
9. **GT** (Gujarat Titans) - Blue
10. **LSG** (Lucknow Super Giants) - Green

### Key Classes & Methods

#### DataManager
```javascript
new DataManager()
  .getAllTeams()              // → Array of all teams
  .getTeam(code)              // → Single team object
  .getTeamPlayers(teamCode)   // → Array of players
  .addPlayer(code, playerData) // → Returns player object
  .deletePlayer(code, id)     // → Returns boolean
  .updatePlayer(code, id, data) // → Returns updated player
  .getStatistics()            // → { totalTeams, totalPlayers, ... }
  .exportXML()                // → XML string
  .exportJSON()               // → JSON object
  .clearAllData()             // → Clears all players
```

#### UIRenderer
```javascript
new UIRenderer(dataManager)
  .renderTeamsGrid(container)    // Renders all 10 teams
  .createTeamCard(team, delay)   // Creates single team card
  .createAdminModal()            // Creates admin modal DOM
  .renderTeamStats(container)    // Stats dashboard
  .renderSquadList(container)    // Team-by-team squad listing
  .renderDebugInfo(container)    // Debug information
  .populateTeamSelect(element)   // Fills <select> with teams
```

#### App
```javascript
new App()
  .initialize()               // Initializes data + UI + events
```

### Event Flow

```
1. Page Load
   ├─ DOMContentLoaded
   ├─ App.initialize()
   │  ├─ new DataManager()     (load XML)
   │  ├─ new UIRenderer()      (get renderer)
   │  ├─ _setupEventListeners() (attach handlers)
   │  └─ _renderHomepage()     (render teams grid)
   └─ Ready for user interaction

2. User clicks "Admin"
   ├─ #adminLink click event
   └─ modal.classList.add('active')

3. User enters password & clicks "Login"
   ├─ _authenticateAdmin()
   ├─ Check password === 'admin2025'
   ├─ If match: Show admin panel + populate content
   └─ If no match: Show error + clear input

4. User adds player
   ├─ #playerForm submit event
   ├─ _handleAddPlayer()
   ├─ DataManager.addPlayer()
   ├─ Refresh squad list + stats + homepage
   └─ Show success notification

5. User exports data
   ├─ #exportXmlBtn / #exportJsonBtn click
   ├─ DataManager.exportXML() / exportJSON()
   ├─ _downloadFile() (triggers browser download)
   └─ Show success message
```

### Admin Panel

**Password:** `admin2025`

**Tabs:**
1. **Teams** - View statistics dashboard
2. **Players** - Add players to teams
3. **Export/Debug** - Export XML/JSON, view system info

**Hidden by default** - Only visible after authentication

### CSS Variables (Customization)

Edit `css/styles.css` `:root` section:

```css
:root {
    /* Colors */
    --color-primary: #1f2937;
    --color-secondary: #6366f1;
    --color-accent: #ec4899;
    
    /* Spacing (in rem) */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    /* ... more ... */
    
    /* Typography */
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    /* ... more ... */
    
    /* Transitions */
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 300ms ease-in-out;
}
```

### Common Tasks

#### Add Player via JS Console
```javascript
const dm = window.iplApp.dm;
dm.addPlayer('RCB', {
  name: 'Virat Kohli',
  role: 'Batsman',
  country: 'India',
  jersey: 18
});
```

#### Get Team Statistics
```javascript
const stats = window.iplApp.dm.getStatistics();
console.log(stats);
// {
//   totalTeams: 10,
//   totalPlayers: 45,
//   averagePlayersPerTeam: "4.50",
//   teams: [...]
// }
```

#### Export Data to File
```javascript
const xml = window.iplApp.dm.exportXML();
// Copy and save as .xml file
```

#### Clear All Data
```javascript
window.iplApp.dm.clearAllData();
window.iplApp._renderHomepage();
```

### Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

### Browser DevTools Tricks

**Console Access:**
```javascript
window.iplApp           // Main app instance
window.iplApp.dm        // DataManager instance
window.iplApp.ui        // UIRenderer instance
```

**View All Teams:**
```javascript
console.table(window.iplApp.dm.getAllTeams());
```

**Get Team Info:**
```javascript
window.iplApp.dm.getTeam('RCB');
```

**Get Players:**
```javascript
window.iplApp.dm.getTeamPlayers('MI');
```

### Deployment Checklist

- [ ] Update password in `js/app.js` (line 24)
- [ ] Update author in `package.json`
- [ ] Update repository URL in `package.json`
- [ ] Add CLOUDFLARE_API_TOKEN to GitHub secrets
- [ ] Add CLOUDFLARE_ACCOUNT_ID to GitHub secrets
- [ ] Push to GitHub `main` branch
- [ ] Verify deployment in Cloudflare dashboard
- [ ] Test admin panel with new password
- [ ] Test data export functionality

### Common Issues

#### "undefined is not an object" error
**Solution:** Ensure scripts load in order: `data-manager.js` → `ui-renderer.js` → `app.js`

#### Admin modal doesn't open
**Solution:** Check browser console for errors. Verify `#adminLink` ID exists.

#### Players don't save
**Solution:** Check browser storage limits. Data is in-memory only (persists until refresh).

#### Styles not loading
**Solution:** Verify CSS files linked correctly in `<head>`. Check CSS variable syntax.

#### Forms not submitting
**Solution:** Check for JavaScript errors in console. Verify form IDs match JS selectors.

### Performance Tips

- **Lazy Load Images** - Add images with lazy loading attribute
- **Minimize CSS** - Use CSS variables for repeated values
- **Optimize JS** - Use event delegation for dynamic content
- **Bundle Size** - Currently ~50KB uncompressed (all vanilla)

### Accessibility Checklist

- ✅ Semantic HTML5 markup
- ✅ Color contrast ≥4.5:1 (WCAG AA)
- ✅ Keyboard navigation (Tab, Enter)
- ✅ Focus visible states
- ✅ Form labels for inputs
- ✅ Respects prefers-reduced-motion
- ✅ Respects prefers-contrast
- ✅ High contrast mode support
- ✅ Print stylesheet included

### Testing Locally

```bash
# Python 3.x
python -m http.server 8000

# Node.js
npx http-server .

# Then visit: http://localhost:8000
```

### Git Workflow

```bash
git clone https://github.com/yourusername/ipl-teams-manager-v2.git
cd ipl-teams-manager-v2
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Open Pull Request on GitHub
```

### Support Matrix

| Feature | Chrome | Firefox | Safari | Mobile |
|---------|--------|---------|--------|--------|
| Core Features | ✅ | ✅ | ✅ | ✅ |
| Admin Panel | ✅ | ✅ | ✅ | ✅ |
| Data Export | ✅ | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |

### Constants

```javascript
// Admin password (change in app.js)
this.adminPassword = 'admin2025';

// Default team stats
totalTeams: 10
defaultPlayersPerTeam: 0 (starts empty)

// Data limits
maxPlayers: unlimited (in-memory)
maxTeams: 10 (hardcoded)
```

---

**Last Updated:** 2024 | **Version:** 2.0.0
