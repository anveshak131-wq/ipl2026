# 🎙️ Admin Live Match Control - Complete Guide

## 🎯 Overview

A comprehensive admin interface to manage live match data in real-time. Control match statistics, player partnerships, bowling figures, AI insights, and key moments with drag-and-drop player selection.

## 📁 Files Created

1. **`admin-live-match.html`** - Main control interface
2. **`css/admin-live-match.css`** - Styling
3. **`js/admin-live-match.js`** - Functionality with drag-and-drop

## ✨ Features

### 1. **Live Status Toggle** 🔴
- Turn match LIVE or Inactive
- Red "LIVE" indicator appears on website when active
- Controls visibility of all live data

### 2. **Match Statistics** 📊
Update in real-time:
- Powerplay Score (e.g., 62/2)
- Total Boundaries (e.g., 18 (14x4, 4x6))
- Current Partnership (e.g., 85 runs (3rd wkt))
- Win Probability (0-100%)

### 3. **Current Partnership** 👥
**Drag & Drop Players:**
- Select team from dropdown
- Drag players from list to batting positions
- Or use dropdown to select players

**Set for Each Batsman:**
- Runs (balls) - e.g., "52 (38)"
- Boundaries - e.g., "4x4, 2x6"
- On-strike indicator (*)

### 4. **Current Bowler** 🎳
**Drag & Drop Bowler:**
- Drag bowler from team players list
- Or select from dropdown

**Bowling Figures:**
- Format: Overs-Maidens-Runs-Wickets
- Example: "3.3-0-32-1"

### 5. **AI Insights** 🤖
**Two Options:**
1. **Manual Entry** - Type your own analysis
2. **AI Generate** - Click button for AI-powered suggestions

**AI generates:**
- Win probability analysis
- Score predictions
- Strategic recommendations
- ML-based insights
- Historical data comparisons

### 6. **Key Moments** ⭐
**Add Match Highlights:**
- Wickets
- Sixes
- Fours
- Milestones (50/100)

**For Each Moment:**
- Type selection
- Description (e.g., "V Kohli c Dhoni b Jadeja")
- Over number (e.g., "15.4")

**Preview & Management:**
- View all posted moments
- Delete individual moments
- Clear all moments

### 7. **Team Players List** 👤
**Draggable Player Cards:**
- Loads players from uploaded team data
- Shows player name and role
- Drag to any position (batsman/bowler)
- Real-time count display

## 🚀 How to Use

### Step 1: Access the Page
```
Open: admin-live-match.html
Or: Click "Live Match Control" in admin panel
```

### Step 2: Turn Match LIVE
1. Toggle the switch at the top
2. Status changes to "Match LIVE"
3. Live indicator appears on website

### Step 3: Update Match Statistics
1. Fill in the statistics form:
   - Powerplay Score
   - Boundaries
   - Partnership info
   - Win Probability
2. Click "Update Stats"
3. Data instantly appears on live page

### Step 4: Set Current Partnership

**Using Drag & Drop:**
1. Select team from dropdown
2. Players list loads automatically
3. Drag player to "Batsman 1" area
4. Drag another to "Batsman 2" area
5. Fill in runs and boundaries
6. Click "Update Partnership"

**Using Dropdowns:**
1. Select player from dropdown
2. Player appears in drop zone
3. Fill in statistics
4. Click "Update Partnership"

**Remove Player:**
- Click × button on dropped player
- Or select "-- Select Player --" from dropdown

### Step 5: Set Current Bowler
1. Drag bowler from players list
2. OR select from dropdown
3. Enter bowling figures (3.3-0-32-1)
4. Click "Update Bowler"

### Step 6: Add AI Insight

**Option A - AI Generate:**
1. Click "Generate with AI" button
2. AI-powered text appears automatically
3. Edit if needed
4. Click "Update AI Insight"

**Option B - Manual:**
1. Type your analysis in textarea
2. Include match situation details
3. Click "Update AI Insight"

**AI Suggestions Include:**
- Win probability percentages
- Score predictions
- Strategic analysis
- ML model insights
- Historical comparisons

### Step 7: Add Key Moments
1. Select moment type (Wicket/Six/Four/Milestone)
2. Enter description
3. Enter over number
4. Click "Add Key Moment"
5. Moment appears in preview list

**Moment appears on live page:**
- Color-coded by type
- Shows description and over
- Updates in real-time

## 📊 Data Flow

```
Admin Control Page → localStorage → Live Match Page
```

### Data Storage Keys:
- `live_match_status` - Live/Inactive toggle
- `live_match_stats` - Match statistics
- `live_match_partnership` - Current batsmen
- `live_match_bowler` - Current bowler
- `live_match_ai_insight` - AI analysis
- `live_match_key_moments` - Array of moments

### Player Data Source:
- Reads from: `uploaded_{TEAM}_players`
- Example: `uploaded_MI_players`
- Contains all uploaded team players

## 🎨 Visual Features

### Drag & Drop:
- **Blue dashed border** - Ready to receive
- **Animated on hover** - Highlights drop zone
- **Green border** - Player successfully dropped
- **Player card** - Shows name, role, avatar

### Status Indicators:
- **Red** - Wickets
- **Orange** - Sixes
- **Green** - Fours
- **Purple** - Milestones

### Toast Notifications:
- Green popup for successful actions
- Auto-dismisses after 3 seconds
- Shows confirmation messages

## 🔄 Real-Time Updates

### On Live Match Page:
When admin updates data, the live page shows:

**Match Stats Sidebar:**
- All statistics automatically populate
- Win probability bar animates
- Updates without page refresh

**Partnership Section:**
- Shows both batsmen
- Displays runs, balls, boundaries
- On-strike indicator (*)

**Bowler Section:**
- Shows bowler name
- Displays bowling figures
- Updates in real-time

**AI Insights:**
- Replaces placeholder with analysis
- Shows ML Analysis badge
- Formatted for readability

**Key Moments:**
- Timeline of recent events
- Color-coded by type
- Scrollable list

## 💡 Best Practices

### 1. **Before Match:**
- Upload team players first
- Test drag & drop functionality
- Prepare AI insights templates

### 2. **During Match:**
- Update stats every 5 overs
- Add key moments immediately
- Keep AI insights current
- Update partnership after each wicket

### 3. **Match Management:**
- Turn LIVE when match starts
- Update stats in real-time
- Add key moments as they happen
- Turn OFF when match ends

### 4. **Player Selection:**
- Use drag & drop for quick selection
- Use dropdowns for precise selection
- Clear players when wicket falls
- Update both batsmen simultaneously

### 5. **AI Insights:**
- Use AI generate for quick content
- Customize generated text
- Update based on match situation
- Include percentages and predictions

## 🛠️ Troubleshooting

### Players Not Loading?
**Solution:**
1. Go to admin-upload.html
2. Select team
3. Upload players via CSV or manual entry
4. Return to live match control

### Drag & Drop Not Working?
**Solution:**
1. Refresh the page
2. Ensure team is selected
3. Check if players list loaded
4. Try using dropdowns instead

### Data Not Appearing on Live Page?
**Solution:**
1. Ensure match is set to LIVE
2. Refresh live-match-updates.html
3. Check if data was saved (toast notification)
4. Verify localStorage in browser console

### Key Moments Not Showing?
**Solution:**
1. Check if moments were added (preview list)
2. Ensure description and over are filled
3. Refresh live page
4. Clear all and re-add if needed

## 📱 Mobile Responsive

✅ **Works on all devices**
✅ **Touch-friendly drag & drop**
✅ **Scrollable player lists**
✅ **Optimized forms for mobile**

## 🔗 Integration

### From Admin Panel:
- Red "Live Match Control" button
- Direct access from navigation
- Opens in same window

### To Live Page:
- "View Live Page" button (top-right)
- Opens in new tab
- See changes in real-time

### Player Data Source:
- Uses uploaded team players
- Synchronized with admin uploads
- Updates automatically when new players added

## 📋 Quick Reference

### Match Setup (5 minutes):
1. ✅ Turn match LIVE
2. ✅ Select teams and load players
3. ✅ Set initial partnership
4. ✅ Add current bowler
5. ✅ Generate AI insight
6. ✅ Add first key moment

### During Match Updates:
- **Every over:** Check if key moment to add
- **Every 5 overs:** Update stats
- **Every wicket:** Update partnership
- **Every 10 overs:** Refresh AI insight

### After Match:
1. ❌ Turn match INACTIVE
2. 💾 Data remains saved
3. 🗑️ Clear for next match (optional)

## 🎯 Example Workflow

### Scenario: MI vs CSK Match

**1. Pre-Match (2:00 PM):**
```
- Select MI team
- Load MI players
- Set opening batsmen (drag Rohit & Ishan)
- Set opening bowler (drag Chahar)
- Turn match LIVE
```

**2. Powerplay (2:30 PM):**
```
- Update stats: "58/1" powerplay
- Update boundaries: "10 (8x4, 2x6)"
- Add key moment: "Wicket - Ishan lbw Chahar - 4.3"
```

**3. Mid-Innings (3:15 PM):**
```
- Update partnership: Rohit 45(32), SKY 28(19)
- Change bowler: Jadeja 2.1-0-18-0
- Generate AI insight
- Add six: "Rohit Sharma • Massive hit - 12.2"
```

**4. Death Overs (4:00 PM):**
```
- Update win probability: 68%
- Add milestone: "Rohit fifty - 15.3"
- Update AI: "MI needs 42 from 30 balls"
```

**5. Match End (4:30 PM):**
```
- Turn match INACTIVE
- Review all moments
- Clear data for next match
```

## 🔐 Admin Access

**Who Can Use:**
- Only admins with access to admin-upload.html
- No public access
- Protected by admin panel access

**Recommended:**
- Use on desktop for best experience
- Keep browser open during match
- Have backup device ready

## ✨ Summary

The Admin Live Match Control provides:

✅ **Real-time control** over all live match data
✅ **Drag & drop** player selection
✅ **AI-powered** insights generation
✅ **Key moments** timeline management
✅ **Professional UI** for easy management
✅ **Mobile responsive** design
✅ **Instant updates** on live page
✅ **Complete control** over match presentation

---

**Access:** `admin-live-match.html`  
**From Admin Panel:** Click "Live Match Control"  
**Live Page:** `live-match-updates.html`

© 2026 IPL Analytics Dashboard - Live Match Control System
