# Testing Guide - IPL Cricket Hub Features

## Quick Test Checklist

Follow these steps to verify all newly implemented features are working correctly.

---

## 1. Fixtures Management with Stadium Dropdown & Auto-Status

### Test Steps:

1. **Open Admin Upload Page**
   - Navigate to: [admin-upload.html](file:///Users/anvesh/Downloads/ipl2020/admin-upload.html)
   - Click on "📅 Fixtures" tab

2. **Add a Fixture**
   - Click "+ Add Fixture" button
   - Fill in the form:
     - **Date**: Select today's date
     - **Team 1**: Select any team (e.g., RCB)
     - **Team 2**: Select another team (e.g., MI)
     - **Venue**: Click the dropdown - you should see 25+ stadiums
     - Try selecting "Wankhede Stadium, Mumbai"
     - Try selecting "Other" - a custom text field should appear
     - **Time (IST)**: Set to current time + 1 hour for "upcoming" or current time - 1 hour for "live"
     - **Status**: This is now auto-calculated, but you can see the dropdown

3. **Save & Verify**
   - Click "💾 Save Fixtures"
   - Check preview section below - status should show automatically:
     - ⏰ Future time = **UPCOMING** (green badge)
     - 🔴 Current time (within 4 hours) = **LIVE** (red badge)
     - ✅ Past time (more than 4 hours ago) = **COMPLETED** (blue badge)

4. **Check Fixtures Page**
   - Navigate to: [fixtures_modern.html](file:///Users/anvesh/Downloads/ipl2020/fixtures_modern.html)
   - Verify fixtures appear with correct auto-calculated status
   - Filter by "Live", "Upcoming", "Completed" tabs

✅ **Expected Results:**
- Stadium dropdown shows Indian grounds
- "Other" option reveals custom input
- Time label shows "Time (IST)"
- Status auto-updates based on date/time
- Fixtures display correctly on public page

---

## 2. Auto-Fill Live Match Teams

### Test Steps:

1. **Create a Live Fixture First**
   - Go to [admin-upload.html](file:///Users/anvesh/Downloads/ipl2020/admin-upload.html)
   - Add a fixture with:
     - Date: Today's date
     - Time: Current time - 30 minutes (to make it "live")
     - Teams: RCB vs MI
     - Venue: M. Chinnaswamy Stadium, Bengaluru
   - Save the fixture

2. **Open Live Match Control**
   - Navigate to: [admin-live-match.html](file:///Users/anvesh/Downloads/ipl2020/admin-live-match.html)
   - Page should load

3. **Verify Auto-Selection**
   - Check if:
     - ✅ Fixture dropdown shows the live match with [LIVE] tag
     - ✅ The live match is automatically selected
     - ✅ "Team A (Batting First)" dropdown is auto-filled with first team
     - ✅ "Team B (Bowling First)" dropdown is auto-filled with second team
     - ✅ Players from both teams load automatically
     - ✅ Toast notification appears: "Live match auto-selected: RCB vs MI"

4. **Test Manual Override**
   - Select a different fixture from dropdown
   - Teams should update automatically
   - Change Team A or Team B manually - should work

✅ **Expected Results:**
- Live match auto-detects and selects on page load
- Both teams auto-fill
- Players load from both teams
- Success toast notification appears

---

## 3. Toss Information Feature

### Test Steps - Admin Side:

1. **Open Live Match Control**
   - Navigate to: [admin-live-match.html](file:///Users/anvesh/Downloads/ipl2020/admin-live-match.html)
   - Make sure teams are selected (RCB vs MI)

2. **Check Toss Panel**
   - Scroll to "🪙 Toss Information" card
   - Verify you see:
     - "Toss Won By" dropdown
     - Hint text: "Select teams first to see options"

3. **Fill Toss Information**
   - **Toss Won By**: Should show actual team names (not "Team A/Team B")
     - Select "Royal Challengers Bangalore"
   - **Decision**: Select "Chose to Bat"
   - You should see a preview box appear showing: "Royal Challengers Bangalore won the toss and elected to bat first"

4. **Generate AI Insight**
   - Click "🪄 AI Insight" button
   - Wait 1.5 seconds
   - AI analysis should appear in text area with venue-specific insights

5. **Save Toss**
   - Click "💾 Update Toss"
   - Toast notification should appear: "Toss information updated successfully!"

✅ **Expected Results:**
- Dropdown shows actual team names
- Preview updates in real-time
- AI generates contextual insights
- Data saves successfully

---

### Test Steps - User Side (Live Page):

1. **Enable Live Status** (Important!)
   - Go to [admin-live-match.html](file:///Users/anvesh/Downloads/ipl2020/admin-live-match.html)
   - Toggle the "Match Status" switch to ON (should show "Live")
   - This makes the match visible on live page

2. **Open Live Match Updates**
   - Navigate to: [live-match-updates.html](file:///Users/anvesh/Downloads/ipl2020/live-match-updates.html)

3. **Verify Toss Display**
   - You should see a prominent golden section with:
     - ✅ Animated 3D coin flipping continuously
     - ✅ Gold "TOSS UPDATE" heading with trophy icon
     - ✅ Team name in gold: "Royal Challengers Bangalore won the toss and..."
     - ✅ Decision in cyan: "elected to bat first"
     - ✅ AI Insight card below (if you generated one)
     - ✅ Smooth entrance animation
     - ✅ Professional design with glassmorphism

4. **Check Animations**
   - Coin should continuously rotate in 3D
   - Lightbulb icon should pulse
   - Sections should slide in smoothly

✅ **Expected Results:**
- Toss section appears prominently
- 3D coin animation works
- Team names and decisions display correctly
- AI insights show if available
- Professional cricket broadcast look

---

## 4. Integration Test (Full Workflow)

### Complete Scenario:

1. **Setup Match**
   ```
   Step 1: Go to admin-upload.html
   Step 2: Add fixture (Today, Current time - 30 min, RCB vs CSK, Wankhede)
   Step 3: Save fixture
   ```

2. **Configure Live Match**
   ```
   Step 4: Go to admin-live-match.html
   Step 5: Verify RCB vs CSK auto-selected
   Step 6: Verify teams auto-filled
   Step 7: Toggle "Match Status" to LIVE
   ```

3. **Add Toss**
   ```
   Step 8: Scroll to Toss Information
   Step 9: Select "Chennai Super Kings" won toss
   Step 10: Select "Chose to Bowl"
   Step 11: Click "AI Insight" button
   Step 12: Click "Update Toss"
   ```

4. **Verify Public View**
   ```
   Step 13: Open live-match-updates.html
   Step 14: See toss section with CSK winning toss
   Step 15: See "elected to bowl first" in cyan
   Step 16: See AI insight below
   ```

✅ **Expected Results:**
- End-to-end workflow works seamlessly
- All data flows from admin to user view
- Animations and styling look professional

---

## 5. Edge Cases to Test

### Test 1: No Teams Selected
- Open admin-live-match.html
- Don't select any teams
- Toss dropdown should say "-- Select teams first --"

### Test 2: Change Teams After Toss
- Select teams, set toss
- Change Team A to different team
- Toss dropdown should update with new team names

### Test 3: Multiple Fixtures
- Create 3 fixtures: one past, one live, one future
- Check if correct statuses show
- Verify only live match auto-selects in admin-live-match

### Test 4: No Live Match
- Create only upcoming fixtures
- Open admin-live-match.html
- Should show fixtures but none auto-selected

### Test 5: Mobile Responsive
- Open live-match-updates.html on phone or narrow browser
- Toss section should stack vertically
- Coin should be smaller (100px)
- Text should be readable

---

## 6. Browser Console Checks

Open browser console (F12) and check for:

### No Errors
```
✅ No red error messages
✅ No "undefined" warnings
✅ Scripts load successfully
```

### Verify localStorage
```javascript
// Paste in console to check data:

// Check fixtures
console.log('Fixtures:', JSON.parse(localStorage.getItem('uploaded_fixtures')));

// Check toss
console.log('Toss:', JSON.parse(localStorage.getItem('live_match_toss')));

// Check live status
console.log('Live Status:', JSON.parse(localStorage.getItem('live_match_status')));
```

---

## 7. Visual Checklist

### Admin Page
- [ ] Stadium dropdown has 25+ options
- [ ] "Other" reveals custom input
- [ ] Time shows "(IST)" label
- [ ] Toss dropdown shows team names
- [ ] AI Insight button works
- [ ] Preview updates in real-time
- [ ] Toast notifications appear

### Live Page
- [ ] 3D coin flips continuously
- [ ] Golden gradient section looks good
- [ ] Text is readable
- [ ] Team name highlighted in gold
- [ ] Decision highlighted in cyan
- [ ] AI insight card (if present) looks good
- [ ] Animations are smooth
- [ ] Responsive on mobile

---

## 8. Performance Checks

- [ ] Pages load in < 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No lag when switching tabs
- [ ] No memory leaks (check Task Manager)

---

## Quick Debug Commands

If something doesn't work, run these in browser console:

```javascript
// Clear all data and start fresh
localStorage.clear();
location.reload();

// Check what's in localStorage
for(let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    console.log(key, localStorage.getItem(key));
}

// Force toss to show on live page
localStorage.setItem('live_match_toss', JSON.stringify({
    winner: 'teamA',
    decision: 'bat',
    insight: 'Test insight message',
    timestamp: new Date().toISOString()
}));
localStorage.setItem('live_match_status', JSON.stringify({isLive: true}));
location.reload();
```

---

## Common Issues & Fixes

### Issue: Teams not auto-filling
**Fix:** Make sure fixture has both team1 and team2 fields

### Issue: Status always shows "upcoming"
**Fix:** Check system time is correct, fixture time format is correct

### Issue: Toss not showing on live page
**Fix:** 
1. Check "Match Status" is toggled to LIVE in admin-live-match.html
2. Verify toss was saved (check console: localStorage.getItem('live_match_toss'))

### Issue: Stadium dropdown empty
**Fix:** Clear cache and reload (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Coin not animating
**Fix:** Check if browser supports CSS 3D transforms (all modern browsers do)

---

## Success Criteria

✅ All 3 main features work
✅ No console errors
✅ Smooth animations
✅ Professional appearance
✅ Mobile responsive
✅ Data persists on reload

---

## Video Recording Suggestion

Record your screen while testing to:
1. Show functionality to stakeholders
2. Debug issues later
3. Create user documentation
4. Share with team

---

## Need Help?

If any test fails:
1. Check browser console for errors (F12)
2. Verify localStorage has correct data
3. Clear browser cache and try again
4. Check network tab for failed requests
5. Try in incognito/private mode

All features use localStorage - no backend required! 🎉
