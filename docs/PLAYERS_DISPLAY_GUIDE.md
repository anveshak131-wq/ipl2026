# Player Display Feature - Individual Team Pages

## Overview
This feature allows uploaded players to be automatically displayed on each team's individual page (e.g., `rcb.html`, `mi.html`) after uploading player data via the admin interface.

## How It Works

### 1. Upload Players
- Go to `admin-upload.html`
- Select a team from the dropdown (e.g., RCB, MI, CSK)
- Choose the players CSV file
- Click "Upload Players"
- Success message will confirm the upload
- The players are stored in browser localStorage with key format: `uploaded_{team}_players`

### 2. View on Team Pages
- Open any team page (e.g., `rcb.html`, `mi.html`)
- Scroll down to see "Uploaded Squad" section
- Players will be displayed in a grid format with:
  - Player name
  - Player role
  - Responsive grid layout
- If no players are uploaded, you'll see a message with link to upload

## CSV Format Required

The CSV file should follow this format:

```csv
Name,Role,Age,Nationality,Batting Style,Bowling Style,Image
Virat Kohli,Batsman,35,Indian,Right-handed,Right-arm medium,virat_kohli.png
AB de Villiers,Wicket-keeper,39,South African,Right-handed,Right-arm medium,abde.png
```

### Required Fields:
- **Name**: Player's full name (displayed on the team card)
- **Role**: Player's role (Batsman, Bowler, All-rounder, Wicket-keeper)
- **Age**: Player's age (numeric)
- **Nationality**: Player's nationality (use "Indian" for Indian players)
- **Batting Style**: Right-handed or Left-handed
- **Bowling Style**: Bowling description or "-" if not applicable
- **Image**: Image filename (e.g., virat_kohli.png)

## Features

✅ **Automatic Display**: Once players are uploaded, they automatically appear on team pages  
✅ **Individual Team Pages**: Shows on each team's dedicated page (rcb.html, mi.html, etc.)  
✅ **Dynamic Loading**: Reads from localStorage on page load  
✅ **Responsive Design**: Adapts to screen size with grid layout  
✅ **Visual Feedback**: Shows player names and roles  
✅ **Graceful Degradation**: Shows "No players uploaded" when no data exists

## Currently Updated Teams
- ✅ **RCB** (rcb.html) - Ready to display players
- ✅ **MI** (mi.html) - Ready to display players  
- ⏳ **Other teams** - Can be updated using the same pattern  

## Technical Details

- Storage: Browser localStorage
- Key Format: `uploaded_{team}_players`
- Data Format: JSON array of player objects
- Team Codes: rcb, mi, csk, srh, kxip, kkr, dc, rr, gt, lsg

## Example Team Codes (for localStorage keys)

- RCB → `uploaded_rcb_players`
- MI → `uploaded_mi_players`
- CSK → `uploaded_csk_players`
- SRH → `uploaded_srh_players`
- KXIP → `uploaded_kxip_players`
- KKR → `uploaded_kkr_players`
- DC → `uploaded_dc_players`
- RR → `uploaded_rr_players`
- GT → `uploaded_gt_players`
- LSG → `uploaded_lsg_players`

## Testing Instructions

### To Test the RCB Upload:
1. Open `admin-upload.html` in your browser
2. Select "RCB" from the team dropdown
3. Click "Choose File" and select a CSV file (or create one with this format):
   ```csv
   Name,Role,Age,Nationality,Batting Style,Bowling Style,Image
   Virat Kohli,Batsman,35,Indian,Right-handed,Right-arm medium,virat_kohli.png
   ```
4. Click "Upload Players" button
5. Wait for the success message showing "Players for RCB uploaded successfully!"
6. Open `rcb.html` in a NEW tab (or refresh if already open)
7. Scroll down to find "Uploaded Squad" section
8. You should see "Virat Kohli" listed

### Common Issues:
- **Not seeing players?** Make sure you:
  - Refresh the team page after uploading
  - Selected the correct team when uploading
  - The CSV file has the correct format
  - Check browser console for any errors
  
- **CSV not parsing?** Ensure:
  - Headers are: Name, Role, Age, Nationality, Batting Style, Bowling Style, Image
  - No extra spaces or special characters
  - File is saved as CSV format

## Notes

- Players are displayed in a responsive grid
- Shows all uploaded players with their roles
- Data persists in browser localStorage until cleared
- To see updates, refresh the team page after uploading
- Each team has its own localStorage key

