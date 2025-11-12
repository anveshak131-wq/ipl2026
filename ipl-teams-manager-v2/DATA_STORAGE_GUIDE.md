# 📊 Data Storage Guide

## Where is Data Stored?

Your IPL Teams Manager stores data **in-memory only** during the browser session.

---

## Storage Location Breakdown

### 1️⃣ **In-Memory XML (JavaScript)**

**File:** `js/data-manager.js`

**Location:** Browser's RAM (JavaScript object)

```javascript
class DataManager {
    constructor() {
        this.xmlDoc = null;  // ← Stored here in memory
        this.initializeData();
    }
}
```

**Storage Type:** 
- XML stored as **DOM objects** in the `xmlDoc` property
- All 10 teams + players are in this XML structure
- Shared across pages via `window.sharedDataManager`

---

### 2️⃣ **Team Data Structure**

```xml
<ipl>
    <teams>
        <team>
            <code>MI</code>
            <name>Mumbai Indians</name>
            <color>#004B87</color>
            <players>
                <player>
                    <name>Rohit Sharma</name>
                    <role>Batsman</role>
                    <country>India</country>
                    <jersey>45</jersey>
                </player>
            </players>
        </team>
        <!-- Other 9 teams... -->
    </teams>
</ipl>
```

---

### 3️⃣ **Memory Location During Session**

| Component | Location | Scope | Persistence |
|-----------|----------|-------|-------------|
| **DataManager** | `window.sharedDataManager` | Shared globally | Until page refresh |
| **XML DOM** | `this.xmlDoc` (in DataManager) | In memory | Until page refresh |
| **Team Objects** | Extracted from XML | In memory | Until page refresh |
| **Player Objects** | XML child elements | In memory | Until page refresh |

---

## Data Lifecycle

### 1. **Page Load** 
```
index.html → App.js → DataManager created
    ↓
window.sharedDataManager = new DataManager()
    ↓
XML initialized with 10 teams (0 players each)
```

### 2. **Add Player**
```
Admin Panel → playerForm.submit → App._handleAddPlayer()
    ↓
dm.addPlayer(teamCode, playerData)
    ↓
XML updated with new player element
    ↓
UI refreshed with new player showing
```

### 3. **View Team Page**
```
Click team link → team.html loads
    ↓
Uses window.sharedDataManager (same data)
    ↓
Reads players from XML
    ↓
Displays players on page
```

### 4. **Refresh/Navigate Away**
```
Page refresh or close → DataManager destroyed
    ↓
New DataManager created with fresh data
    ↓
ALL added players are LOST ❌
    ↓
Back to default 10 teams (0 players each)
```

---

## NO Server/Database Storage ⚠️

❌ **Data NOT stored in:**
- Database
- Server files
- Local storage
- SessionStorage
- Cookies
- Cloud

✅ **Data ONLY in:**
- Browser RAM
- JavaScript memory
- Active window.sharedDataManager

---

## How to Preserve Data

### Option 1: Export XML
1. Go to Admin Panel → Export/Debug tab
2. Click **"📄 Export XML"** button
3. Browser downloads `ipl-teams-data.xml`
4. Save the file

### Option 2: Export JSON
1. Go to Admin Panel → Export/Debug tab
2. Click **"📊 Export JSON"** button
3. Browser downloads JSON file
4. Save the file

### Option 3: Manual Copy
1. Go to Admin Panel → Export/Debug tab
2. Copy debug info (XML content)
3. Paste in text editor
4. Save as `.xml` file

---

## Data Methods in DataManager

```javascript
// Get all teams
dm.getAllTeams()

// Get specific team
dm.getTeam(teamCode)

// Get team's players
dm.getTeamPlayers(teamCode)

// Add player
dm.addPlayer(teamCode, playerData)

// Remove player
dm.removePlayer(teamCode, playerName)

// Export as XML
dm.exportXML()

// Export as JSON
dm.exportJSON()

// Clear all data
dm.clearAllData()
```

---

## Current Data State

### On Cloudflare Pages (Production)
- 10 teams loaded with 4 sample players each
- Any players you add are **temporary** (session only)
- Refresh page = data lost
- No persistence

### Example Team Structure:
```
CSK (Chennai Super Kings)
├── Ruturaj Gaikwad (Batsman, India, #1)
├── Devon Thomas (Batsman, Jamaica, #7)
├── MS Dhoni (Wicket Keeper, India, #7)
└── Deepak Chahar (Bowler, India, #66)
```

---

## Architecture Overview

```
Browser Session
    ↓
window.sharedDataManager
    ↓
DataManager Instance
    ↓
xmlDoc (DOM)
    ↓
<ipl>
    <teams>
        <team>...</team> ← 10 Teams
    </teams>
</ipl>
```

---

## Summary

📍 **Where:** JavaScript in-memory storage (RAM)

🔄 **Scope:** Current browser session only

⏱️ **Duration:** Until page refresh or browser close

💾 **Save Permanently:** Use Export XML/JSON feature

🌐 **Server:** No database connection (static site hosting)

---

**All data is temporary unless exported!** 📌
