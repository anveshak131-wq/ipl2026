# Automatic Fixture Status Update System

## Overview
The fixture status (upcoming/live/completed) is now automatically calculated based on the date and time set for each fixture. This works across all pages where fixtures are displayed.

## Changes Made

### 1. Stadium Dropdown (admin-upload.html)
- Added dropdown with 25+ IPL stadiums from across India and UAE
- Includes "Other" option that reveals a custom text field
- Time label changed to "Time (IST)" to indicate Indian Standard Time

### 2. Auto Status Calculation
Status is automatically determined based on:
- **Upcoming**: Match date/time is in the future
- **Live**: Match is currently happening (within 4 hours from start time)
- **Completed**: Match ended (more than 4 hours after start time)

### 3. Files Updated

#### `/js/fixtures-scripts.js`
- Added `getAutoStatus()` function
- Automatically calculates status when loading fixtures
- Used in: `fixtures_modern.html`

#### `/js/admin-scripts-full.js`
- Added `getAutoFixtureStatus()` function
- Shows real-time status in admin preview
- Color-coded badges: Live (red), Completed (blue), Upcoming (green)
- Used in: `admin-upload.html`

#### `/js/admin-live-match.js`
- Added auto-status to fixture dropdown
- Shows status next to each fixture in selector
- Used in: `admin-live-match.html`

#### `/js/live-match-updates.js`
- Added smart upcoming match detection
- Filters out completed matches
- Shows only truly upcoming matches
- Compatible with both 'uploaded_fixtures' and 'fixtures' localStorage keys
- Used in: `live-match-updates.html`

## How It Works

### IST Time Calculation
```javascript
const fixtureDateTime = new Date(`${date}T${time}:00+05:30`);
```
The `+05:30` suffix ensures times are interpreted as Indian Standard Time (IST).

### Match Duration
- Assumes each match lasts **4 hours** (typical IPL match duration)
- Match is "live" from start time to 4 hours after start time
- After 4 hours, status changes to "completed"

### Auto-Update
- Status is calculated every time a page loads
- No manual status update needed in admin panel
- The "Status" dropdown in admin is now optional/informational only

## Pages Affected

1. **fixtures_modern.html** - Public fixtures page
2. **admin-upload.html** - Admin fixture management
3. **admin-live-match.html** - Live match control panel
4. **live-match-updates.html** - Live match commentary page

## Example

If you set:
- Date: 2025-11-05
- Time: 19:30 (IST)

Status will be:
- Before Nov 5, 7:30 PM → **UPCOMING**
- Nov 5, 7:30 PM to 11:30 PM → **LIVE**
- After Nov 5, 11:30 PM → **COMPLETED**

## Auto-Fill Live Match Teams

### Admin Live Match Control Enhancement

When you open [admin-live-match.html](file:///Users/anvesh/Downloads/ipl2020/admin-live-match.html):

1. **Automatic Live Match Detection**: System checks all fixtures for currently live matches
2. **Auto-Selection**: If a live match is found, it's automatically selected in the dropdown
3. **Auto-Fill Teams**: Team A and Team B dropdowns are automatically filled with the teams from the live match
4. **Auto-Load Players**: Player lists from both teams are automatically loaded for drag-and-drop

### How It Works

On page load, the system:
- Scans all fixtures
- Identifies any match with "live" status (based on current time)
- Selects the first live match found
- Populates Team A and Team B fields
- Shows a toast notification: "Live match auto-selected: [Team1] vs [Team2]"

### Manual Override

You can still:
- Select a different fixture from the dropdown
- Manually change Team A or Team B if needed
- Work with upcoming or completed matches

## Benefits

✅ No manual status updates needed
✅ Always accurate and real-time
✅ Consistent across all pages
✅ Timezone-aware (IST)
✅ Automatic match progression
✅ Auto-fill teams for live matches
✅ Faster live match management workflow
