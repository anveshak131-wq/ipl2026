# 🏏 IPL Cricket Hub Official Website

Welcome to the official IPL Cricket Hub website repository!

**✨ Fully Redesigned | Modern Design | Production Ready** - Your ultimate destination for Indian Premier League cricket information built with cutting-edge web technologies.

![IPL Cricket Hub](https://img.shields.io/badge/IPL-Cricket_Hub-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Features

### Modern Technologies
- ✅ **HTML5** - Semantic markup and modern structure
- ✅ **CSS3** - Advanced styling with Grid, Flexbox, and animations
- ✅ **JavaScript/AJAX** - Dynamic content loading and real-time updates
- ✅ **Responsive Design** - Mobile-first approach for all devices
- ✅ **Glassmorphism** - Modern UI design with backdrop filters
- ✅ **Smooth Animations** - Engaging user experience

### Key Pages

#### 🏠 **Homepage** (`index.html`)
- Interactive team grid with hover effects
- Animated statistics counters
- Modal dialogs for team details
- Responsive navigation with mobile menu

#### 📅 **Fixtures** (`fixtures_modern.html`)
- Complete IPL match schedule
- Advanced filtering by team, status, and date
- Live match indicators
- Interactive match cards

#### 📊 **Points Table** (`points_modern.html`)
- Sortable columns (Points, NRR, Wins)
- Real-time statistics updates
- Team form indicators
- Animated counters

#### 🎯 **Live Scores** (`scores_modern.html`)
- Real-time score updates
- Detailed scorecards
- Batting and bowling statistics
- Live match indicators

## 🚀 Quick Start

### View the Website
Visit: [https://anveshak131-wq.github.io/ipl2026/](https://anveshak131-wq.github.io/ipl2026/)

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/anveshak131-wq/ipl2026.git
   cd ipl2026
   ```

2. **Open in browser**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Node.js
   npx http-server
   ```

## 📁 Project Structure

```
ipl2026/
├── index.html              # Modern homepage
├── fixtures_modern.html    # Enhanced fixtures
├── points_modern.html      # Interactive points table
├── scores_modern.html     # Live scores
├── home.html              # Original homepage (backup)
├── fixtures.html          # Original fixtures (backup)
├── pointstable.html       # Original points (backup)
├── about.html             # About page
├── [team].html            # Team pages (RCB, MI, CSK, etc.)
├── [team]_players/        # Player directories
├── *.png                  # Team logos and images
├── DEPLOYMENT_GUIDE.md    # Deployment instructions
└── README.md              # This file
```

## 🎨 Modern Features

### Design Elements
- **Glassmorphism Effects** - Modern frosted glass design
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Engaging user interactions
- **Hover Effects** - Interactive elements
- **Responsive Grid** - CSS Grid layouts
- **Mobile Optimization** - Touch-friendly interface

### Interactive Features
- **Dynamic Content Loading** - AJAX-powered updates
- **Real-time Statistics** - Live data simulation
- **Filtering & Sorting** - Advanced data manipulation
- **Modal Dialogs** - Team and match details
- **Smooth Scrolling** - Enhanced navigation
- **Live Updates** - Simulated real-time changes

## 🌐 Teams

1. **Royal Challengers Bangalore (RCB)** 🇮🇳
2. **Mumbai Indians (MI)** 🇮🇳
3. **Chennai Super Kings (CSK)** 🇮🇳
4. **Sunrisers Hyderabad (SRH)** 🇮🇳
5. **Kings XI Punjab (KXIP)** 🇮🇳
6. **Kolkata Knight Riders (KKR)** 🇮🇳
7. **Delhi Capitals (DC)** 🇮🇳
8. **Rajasthan Royals (RR)** 🇮🇳

## 📱 Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers (iOS & Android)

## 🔧 Deployment

This website is deployed using **GitHub Pages**.

### Deploy Your Own Copy

1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Select `main` branch** as source
4. **Your site will be live** at: `https://yourusername.github.io/ipl2026/`

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📝 Technologies Used

| Technology | Description |
|-----------|-------------|
| HTML5 | Semantic markup and structure |
| CSS3 | Advanced styling and animations |
| JavaScript | Dynamic functionality |
| AJAX | Asynchronous data loading |
| CSS Grid | Modern layout system |
| Flexbox | Flexible component layout |
| Font Awesome | Icon library |
| Google Fonts | Typography |

## 🎯 Performance

- ⚡ Fast loading times
- 📱 Mobile-optimized
- ♿ Accessibility features
- 🎨 Modern design
- 🔄 Real-time updates

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Anvesh Ak**
- GitHub: [@anveshak131-wq](https://github.com/anveshak131-wq)
- Email: anvesh.ak.131@gmail.com

## 🙏 Acknowledgments

- IPL (Indian Premier League)
- All cricket fans and enthusiasts
- Web development community

## ⭐ Show Support

If you find this project helpful, please give it a ⭐ on GitHub!

---

# IPL Cricket Hub Admin Panel

## Overview
This project now supports **manual-only** data entry for all IPL Cricket Hub admin tasks. All CSV/file upload features have been removed. All data is managed via the admin panel and stored in localStorage.

## Key Features
- **Manual entry only** for players, fixtures, and points table (no file upload).
- All data is editable and deletable at any time via the admin panel.
- Data persists in localStorage until explicitly changed or deleted.
- **Players:**
  - Add, edit, and delete players for each team.
  - Set Captain, Vice-Captain, and Wicket-Keeper status.
  - Nationality and Bowling Style are dropdowns with common options.
  - If you select "Other" for Bowling Style, an extra box appears to specify the style, and this value is saved as the player's bowling style.
  - Foreign players are auto-detected and shown with a 🌍 symbol.
  - Duplicate players for a team are prevented (deduplication by normalized name).
  - Batting/Bowling styles are shown only when a player is clicked.
- **Fixtures:**
  - Add, edit, and delete fixtures manually.
- **Points Table:**
  - Add, edit, and delete points table rows manually.
- All changes are reflected on the frontend and persist until changed or deleted.

## Usage
1. Open `admin-upload.html` in your browser.
2. Select the section (Players, Fixtures, Points Table) you want to manage.
3. Enter data manually using the provided forms.
4. Save your changes. Data is stored in your browser and reflected on the website.

## Notes
- **No file upload or download is available.**
- Clearing your browser storage will erase all manually entered data.
- For more details, see `UPLOAD_INSTRUCTIONS.md`.

**Made with ❤️ for IPL Cricket Fans** 🏏

