# IPL Teams Manager v2

A production-ready, static IPL cricket teams manager with all 10 teams, hidden developer admin panel, and modern AI-grade UI/UX. Built with vanilla HTML5, CSS3, and ES6+ JavaScript with in-memory XML data storage.

## 🎯 Features

### Core Features
- **All 10 IPL Teams** - Complete roster of Mumbai Indians, Chennai Super Kings, Royal Challengers Bangalore, Kolkata Knight Riders, Delhi Capitals, Sunrisers Hyderabad, Rajasthan Royals, Punjab Kings, Gujarat Titans, and Lucknow Super Giants
- **Team Details** - View complete squad information including player roles, countries, and jersey numbers
- **In-Memory Data** - Lightning-fast XML-based data management with DOMParser/XMLSerializer
- **Zero Dependencies** - Vanilla JavaScript, no external frameworks or libraries
- **No Persistence** - Data resets on page refresh (intentional design for development)

### Admin Features
- **Hidden Dev Admin Panel** - Password-protected admin interface (`/admin2025`)
- **Player Management** - Add, view, and manage players across all teams
- **Team Statistics** - Real-time analytics dashboard with team and player counts
- **Data Export** - Export data as XML or JSON for debugging
- **Tab-Based Interface** - Teams, Players, and Export/Debug tabs

### Design Features
- **Modern UI/UX** - Gradients, animations, smooth transitions
- **Team Brand Colors** - Each team uses official IPL brand colors
- **Responsive Design** - Mobile-first, fully responsive across all devices
- **WCAG AA Accessibility** - High contrast colors, keyboard navigation, focus states
- **Smooth Animations** - Fade-in, slide, bounce effects with prefers-reduced-motion support
- **Dark Mode Ready** - CSS variables support optional dark theme

## 📦 Project Structure

```
ipl-teams-manager-v2/
├── index.html                 # Homepage with teams grid
├── team.html                  # Team detail page template
├── css/
│   ├── styles.css            # Global styles, variables, base components
│   ├── teams.css             # Teams page and card styles
│   └── team-page.css         # Team detail page styles
├── js/
│   ├── data-manager.js       # In-memory XML CRUD operations
│   ├── ui-renderer.js        # Dynamic DOM rendering utilities
│   └── app.js                # Main app initialization and event handlers
├── wrangler.toml             # Cloudflare Pages configuration
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD pipeline
└── README.md                 # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ipl-teams-manager-v2.git
   cd ipl-teams-manager-v2
   ```

2. **Start a local server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Node.js
   npx http-server .
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

4. **Access admin panel:**
   - Click "Admin" in navbar
   - Password: `admin2025` (hint: think about the year)

### Live Demo

Visit: https://ipl-teams-manager.pages.dev

## 📖 Usage Guide

### Viewing Teams
1. Browse the homepage to see all 10 teams
2. Click any team card to view squad details
3. Each team displays:
   - Team name and code
   - Founded year
   - Home stadium
   - Current squad with player roles and jersey numbers

### Adding Players (Admin)
1. Click "Admin" in navigation
2. Enter password: `admin2025`
3. Go to "Players" tab
4. Select team and fill in player details:
   - Name (required)
   - Role (Batsman, Bowler, All-rounder, Wicket Keeper)
   - Country (optional)
   - Jersey Number (1-99)
5. Click "Add Player"

### Viewing Statistics (Admin)
1. Click "Admin" and authenticate
2. Go to "Teams" tab
3. View:
   - Total teams and players
   - Average players per team
   - Detailed team breakdown with player counts

### Exporting Data (Admin)
1. Click "Admin" and authenticate
2. Go to "Export/Debug" tab
3. Choose export format:
   - **XML** - Complete data structure as XML
   - **JSON** - Formatted JSON with timestamp
4. File downloads automatically

### Clearing Data (Admin)
1. Click "Admin" and authenticate
2. Go to "Export/Debug" tab
3. Click "🗑️ Clear All Data"
4. Confirm deletion

## 🔐 Security Notes

- **Password**: Default is `admin2025` (easily changeable in `app.js`)
- **Admin Panel**: Hidden from UI, requires direct nav or browser history
- **No Backend**: All data is client-side only, no server storage
- **Data Isolation**: Each browser tab has independent data

To change password:
```javascript
// In js/app.js, line 24
this.adminPassword = 'your-new-password';
```

## 🛠️ Development

### Architecture Overview

#### DataManager (`js/data-manager.js`)
- In-memory XML data store using DOMParser/XMLSerializer
- CRUD operations: `addPlayer()`, `deletePlayer()`, `updatePlayer()`, `getTeam()`
- Supports: `getTeamPlayers()`, `getAllTeams()`, `getStatistics()`
- Export: `exportXML()`, `exportJSON()`

#### UIRenderer (`js/ui-renderer.js`)
- Dynamic DOM rendering utilities
- Methods: `renderTeamsGrid()`, `createTeamCard()`, `createAdminModal()`
- Team stats and squad list rendering
- Admin form population and debug info display

#### App (`js/app.js`)
- Main application orchestration
- Event listeners for modal, forms, and buttons
- Admin authentication and panel management
- Tab switching and form submission handling
- Notification system (success/error toasts)

### Adding Custom Teams

Edit `DataManager.initializeData()` in `js/data-manager.js`:

```javascript
<team>
    <code>NEW</code>
    <name>New Team Name</name>
    <color>#HEX_COLOR</color>
    <darkColor>#DARK_HEX_COLOR</darkColor>
    <city>City Name</city>
    <stadium>Stadium Name</stadium>
    <founded>2024</founded>
    <players></players>
</team>
```

### Customizing Styling

Edit CSS variables in `css/styles.css`:

```css
:root {
    --color-primary: #1f2937;
    --color-secondary: #6366f1;
    --color-accent: #ec4899;
    /* ... more variables ... */
}
```

## 🚢 Deployment

### Cloudflare Pages (Recommended)

#### Prerequisites
- GitHub account
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

#### Steps

1. **Create GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: IPL Teams Manager v2"
   git branch -M main
   git remote add origin https://github.com/yourusername/ipl-teams-manager-v2.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages → Create a project
   - Select GitHub repository
   - Build settings:
     - Framework: None
     - Build command: (leave empty)
     - Build output directory: `.` (root)
   - Deploy

3. **Configure GitHub Actions:**
   - Add secrets to GitHub repo:
     - `CLOUDFLARE_API_TOKEN` - From Cloudflare dashboard
     - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
   - Workflow will auto-deploy on push to `main`

#### Custom Domain
1. In Cloudflare dashboard, add custom domain
2. Update DNS records (instructions provided)
3. Automatic HTTPS via Cloudflare

### Alternative Platforms

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### GitHub Pages
1. Enable GitHub Pages in repo settings
2. Set branch to `main`
3. Visit: `https://yourusername.github.io/ipl-teams-manager-v2/`

## 📊 Data Format

### XML Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<ipl>
    <teams>
        <team>
            <code>MI</code>
            <name>Mumbai Indians</name>
            <color>#004B87</color>
            <darkColor>#003056</darkColor>
            <city>Mumbai</city>
            <stadium>Wankhede Stadium</stadium>
            <founded>2008</founded>
            <players>
                <player id="player_123456_abc123">
                    <name>Virat Kohli</name>
                    <role>Batsman</role>
                    <country>India</country>
                    <jersey>18</jersey>
                </player>
            </players>
        </team>
    </teams>
</ipl>
```

### JSON Export Format
```json
{
    "timestamp": "2024-01-15T10:30:00.000Z",
    "teams": [
        {
            "code": "MI",
            "name": "Mumbai Indians",
            "color": "#004B87",
            "players": [...]
        }
    ]
}
```

## ♿ Accessibility Features

- **WCAG AA Compliance** - High contrast color ratios (≥4.5:1)
- **Keyboard Navigation** - Full keyboard support with visible focus states
- **Semantic HTML5** - Proper heading hierarchy, form labels, alt text
- **Reduced Motion** - Respects `prefers-reduced-motion` preference
- **Screen Reader Support** - Semantic markup and ARIA attributes
- **Focus Management** - Modal trap focus for admin panel

## 🎨 Color Palette

### IPL Team Colors
| Team | Primary | Secondary |
|------|---------|-----------|
| MI | #004B87 | #003056 |
| CSK | #FFC72C | #FFA500 |
| RCB | #EC1C24 | #C41E3A |
| KKR | #3A225E | #281847 |
| DC | #004B5E | #002F3E |
| SRH | #FF6D1F | #E04E0D |
| RR | #E91E63 | #C2185B |
| PBKS | #EE2C2C | #C41E3A |
| GT | #1E90FF | #1161BF |
| LSG | #5B8F5B | #3D5C3D |

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Limitations

- Data resets on page refresh (intentional)
- No backend persistence (by design)
- In-memory storage only (suitable for dev/demo)
- No authentication beyond password (dev-only)

## 🔮 Future Enhancements

- [ ] Local storage option to persist data
- [ ] Backend API integration (optional)
- [ ] Player statistics and match history
- [ ] Live match updates integration
- [ ] Multiple language support
- [ ] Notifications for player additions
- [ ] Advanced search and filtering
- [ ] Team comparison tools

## 📝 License

MIT License - Feel free to use for personal and commercial projects

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📧 Support

For issues, questions, or suggestions:
- Open GitHub Issue
- Email: support@iplteamsmanager.dev
- Twitter: [@iplteams](https://twitter.com/iplteams)

## 🎉 Credits

- **Data**: Official IPL team information
- **Colors**: Official IPL brand guidelines
- **Icons**: Built-in emoji + custom SVG
- **Fonts**: System fonts (no external dependencies)
- **Infrastructure**: Cloudflare Pages + GitHub Actions

---

**Built with ❤️ for cricket enthusiasts | v2.0.0 | 2024**
