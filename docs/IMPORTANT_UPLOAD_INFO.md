# ⚠️ IMPORTANT: How to Test Player Upload

## Quick Test Instructions

### 1. Upload Players via Admin
1. Open **admin-upload.html** in your browser
2. Under "Upload Team Player Lists":
   - Select team: **Royal Challengers Bangalore (RCB)**
   - Click "Choose File"
   - Select the file: **sample-players.csv** (already in project root)
   - Click "Upload Players"
   - You should see: "Players for RCB uploaded successfully! (X players loaded)"

### 2. View Uploaded Players
1. Open **rcb_players/rcb_players_modern.html** in your browser
2. You should now see the uploaded players displayed
3. Foreign players (AB de Villiers, Aaron Finch, etc.) will show orange "Overseas Player" badges
4. Indian players (Virat Kohli, etc.) have no badge

## ⚠️ CRITICAL: Use the MODERN Player Page

**Old player page:** `rcb_players.html` (won't show uploaded data)
**New player page:** `rcb_players_modern.html` (shows uploaded data)

Always use: **rcb_players/rcb_players_modern.html**

## How Foreign Player Indicator Works

### Automatic Detection:
- If nationality = "Indian" or "India" → NO badge
- If nationality = anything else → Orange "Overseas Player" badge

### The Badge:
- Orange background (#FF6B35)
- Globe icon 🌍
- Text: "Overseas Player"
- Pulse animation
- Appears next to player name

### Example CSV:
```csv
Name,Role,Nationality,Image
Virat Kohli,Batsman,Indian,virat_kohli.png
AB de Villiers,Wicket-keeper,South African,abde.png
```

Result:
- Virat Kohli: Regular display (Indian)
- AB de Villiers: Orange badge (South African)

## File Locations

- **Admin Upload:** admin-upload.html (root)
- **Sample CSV:** sample-players.csv (root)
- **Modern Player Page:** rcb_players/rcb_players_modern.html
- **Upload Guide:** PLAYER_UPLOAD_GUIDE.md

## Data Storage

Currently using browser's localStorage:
- Data persists in browser until cleared
- Upload once, view multiple times
- Page refresh keeps the data
- Browser clear will remove it

For production, replace localStorage with:
- Backend database
- API endpoints
- Server-side file storage

