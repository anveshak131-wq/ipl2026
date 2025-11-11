# Toss Information Feature

## Overview
Added a comprehensive toss management panel in the admin-live-match control center with AI-powered insights that automatically displays on the live match updates page.

## Features

### Admin Panel (admin-live-match.html)

#### Toss Information Card
Located in the right column after match selection, includes:

1. **Toss Winner Selection**
   - Team A / Team B dropdown
   - Auto-updates preview when selected

2. **Decision Selection**
   - Chose to Bat
   - Chose to Bowl

3. **AI-Powered Insight Generator**
   - Click "AI Insight" button to generate analysis
   - Considers:
     - Venue conditions
     - Pitch characteristics
     - Historical data
     - Dew factor
     - Team composition
   - Generates realistic cricket commentary

4. **Live Preview**
   - Shows formatted toss result
   - Gold-themed design
   - Updates in real-time

### Live Match Page (live-match-updates.html)

#### Toss Display - Premium Design
Automatically appears between match header and main content when toss is posted:

1. **Animated 3D Coin**
   - Realistic 3D coin flip animation
   - Continuous rotation effect
   - Gold (Heads) and Silver (Tails) sides
   - Glowing shadow effects
   - 120px diameter with smooth animations

2. **Toss Banner**
   - Full-width prominent section
   - Golden gradient background overlay
   - Glassmorphism design with blur effects
   - Large, bold "TOSS UPDATE" heading
   - Trophy icon with glow effect
   - Team winner in highlighted gold text
   - Decision in cyan highlight

3. **AI Insight Card** (if available)
   - Separate blue-themed card below banner
   - Pulsing lightbulb icon
   - Professional cricket analysis text
   - Slide-up animation on reveal

4. **Visual Effects**
   - Entry animation with bounce effect
   - Radial gradient background glow
   - Multiple shadow layers for depth
   - Responsive design for mobile
   - Smooth transitions

## How to Use

### For Admins

1. **Open Admin Live Match Control**
   - Navigate to [admin-live-match.html](file:///Users/anvesh/Downloads/ipl2020/admin-live-match.html)

2. **Select Match**
   - Choose from fixtures dropdown (live matches auto-selected)
   - Teams are auto-filled

3. **Enter Toss Information**
   ```
   Step 1: Select "Toss Won By" (Team A or Team B)
   Step 2: Select "Decision" (Bat or Bowl)
   Step 3: (Optional) Click "AI Insight" to generate analysis
   Step 4: Click "Update Toss"
   ```

4. **View Preview**
   - Preview shows: "[Team Name] won the toss and elected to [bat/bowl] first"

### AI Insight Examples

The AI generates contextual insights like:

```
"Mumbai Indians has opted to bat first at Wankhede Stadium. 
This is a strategic decision considering the pitch conditions and 
dew factor expected later in the evening. Teams batting second 
have won 58% of matches at this venue in previous seasons."
```

```
"Chennai Super Kings wins the toss and chooses to bowl first. 
The pitch at MA Chidambaram Stadium typically offers good bounce 
and carry early on, making batting first advantageous. However, 
dew in the second innings could make gripping the ball difficult 
for bowlers."
```

## Technical Details

### Data Storage

**localStorage Key**: `live_match_toss`

**Data Structure**:
```javascript
{
  winner: "teamA" | "teamB",
  decision: "bat" | "bowl",
  insight: "AI-generated analysis text",
  timestamp: "2025-11-02T10:30:00.000Z"
}
```

### Functions

#### Admin Side
- `updateTossOptions()` - Updates preview when selections change
- `updateTossPreview()` - Renders toss preview box
- `generateTossInsight()` - AI-powered insight generation
- `updateToss()` - Saves toss to localStorage

#### Live Page Side
- `loadTossInfo()` - Loads and displays toss information
- `getTeamFullName()` - Converts team codes to full names

### CSS Styling

**File**: `/css/live-match-updates.css`

**Classes**:
- `.toss-info-section` - Container
- `.toss-card` - Main card with gold gradient
- `.toss-header` - Header with coin icon
- `.toss-result` - Toss outcome text
- `.toss-insight` - AI analysis section

**Animations**:
- `tossSlideIn` - Card entrance animation
- `coinFlip` - Rotating coin icon

## Integration

### Where Toss Appears

1. **Admin Panel** - Right column preview
2. **Live Match Updates** - Above commentary feed
3. **Automatically displays** when match is live

### Workflow

```
Admin selects toss winner → 
Selects decision → 
Generates AI insight (optional) → 
Clicks "Update Toss" → 
Saved to localStorage → 
Live page auto-displays toss card
```

## Benefits

✅ Professional toss announcement
✅ AI-powered contextual insights
✅ Beautiful golden theme
✅ Animated coin flip effect
✅ Automatic display on live page
✅ Real-time preview in admin
✅ Venue-aware analysis
✅ Historical data references

## Future Enhancements

- Fetch real weather data via API
- Historical toss statistics per venue
- Captain quotes integration
- Toss prediction feature
- Multi-language support
