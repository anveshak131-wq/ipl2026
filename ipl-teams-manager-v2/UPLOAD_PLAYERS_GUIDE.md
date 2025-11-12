# � How to Upload Player Details One by One

## Access Admin Panel

1. **Click "Admin"** link in top navigation bar
2. **Enter password**: `admin2025`
3. Click **Login** button

---

## Where to Add Players

### Manual Add (One Player at a Time)

**Location:** Admin Panel → **Players Tab**

#### Steps:

1. **Select Team**
   - Click dropdown
   - Choose team (CSK, MI, RCB, KKR, DC, KXIP, RR, SRH, GT, LSG)

2. **Enter Player Name**
   - Type player's full name (e.g., "Ruturaj Gaikwad")

3. **Select Role**
   - Choose from 4 options:
     - Batsman
     - Bowler
     - All-rounder
     - Wicket Keeper

4. **Enter Country**
   - Type country name (e.g., "India", "Australia")

5. **Enter Jersey Number**
   - Enter number between 1-99

6. **Click "Add Player"** button

7. ✅ See success message at top right

8. **Repeat** for next player

---

## Form Fields Reference

| Field | Type | Length | Required | Example |
|-------|------|--------|----------|---------|
| Team | Dropdown | N/A | ✅ | CSK |
| Player Name | Text | Any | ✅ | Ruturaj Gaikwad |
| Role | Dropdown | N/A | ✅ | Batsman |
| Country | Text | Any | ✅ | India |
| Jersey Number | Number | 1-99 | ✅ | 1 |

---

## Valid Team Names

| Team Code | Full Name |
|-----------|-----------|
| CSK | Chennai Super Kings |
| MI | Mumbai Indians |
| RCB | Royal Challengers Bangalore |
| KKR | Kolkata Knight Riders |
| DC | Delhi Capitals |
| KXIP | Kings XI Punjab |
| RR | Rajasthan Royals |
| SRH | Sunrisers Hyderabad |
| GT | Gujarat Titans |
| LSG | Lucknow Super Giants |

---

## Valid Roles

Choose one from dropdown:

- **Batsman** - Opening batsman, middle order, etc.
- **Bowler** - Fast bowler, spinner, etc.
- **All-rounder** - Plays both batting and bowling
- **Wicket Keeper** - Keeper role

---

## Current Squad View

After adding players:
- Scroll down in Players tab to see **"Current Squad"** section
- Shows all players already added
- Displays: Name, Role, Country, Jersey Number
- Remove option available for each player

---

## Example Players to Add

### CSK (Chennai Super Kings)
- Ruturaj Gaikwad | Batsman | India | 1
- MS Dhoni | Wicket Keeper | India | 7
- Devon Thomas | Batsman | Jamaica | 7
- Deepak Chahar | Bowler | India | 66

### MI (Mumbai Indians)
- Rohit Sharma | Batsman | India | 45
- Jasprit Bumrah | Bowler | India | 93
- Ishan Kishan | Wicket Keeper | India | 4
- Hardik Pandya | All-rounder | India | 33

### RCB (Royal Challengers Bangalore)
- Virat Kohli | Batsman | India | 18
- Josh Hazlewood | Bowler | Australia | 23
- Dinesh Karthik | Wicket Keeper | India | 23
- Glenn Maxwell | All-rounder | Australia | 32

### KKR (Kolkata Knight Riders)
- Shreyas Iyer | Batsman | India | 5
- Sunil Narine | Bowler | Trinidad | 75
- Varun Chakravarthy | Bowler | India | 13
- Chris Lynn | Batsman | Australia | 4

### DC (Delhi Capitals)
- Rishabh Pant | Wicket Keeper | India | 21
- Steve Smith | Batsman | Australia | 49
- Axar Patel | All-rounder | India | 11
- Prithvi Shaw | Batsman | India | 10

### KXIP (Kings XI Punjab)
- Mayank Agarwal | Batsman | India | 15
- Kagiso Rabada | Bowler | South Africa | 25
- Johnny Bairstow | Wicket Keeper | England | 17
- Liam Livingstone | All-rounder | England | 26

### RR (Rajasthan Royals)
- Sanju Samson | Wicket Keeper | India | 23
- Jos Buttler | Batsman | England | 63
- Yuzvendra Chahal | Bowler | India | 30
- Trent Boult | Bowler | New Zealand | 18

### SRH (Sunrisers Hyderabad)
- Kane Williamson | Batsman | New Zealand | 22
- Bhuvneshwar Kumar | Bowler | India | 11
- Heinrich Klaasen | Wicket Keeper | South Africa | 69
- Umran Malik | Bowler | India | 6

### GT (Gujarat Titans)
- Shubman Gill | Batsman | India | 23
- Mohammed Shami | Bowler | India | 11
- Wriddhiman Saha | Wicket Keeper | India | 34
- Rashid Khan | All-rounder | Afghanistan | 19

### LSG (Lucknow Super Giants)
- KL Rahul | Batsman | India | 1
- Krunal Pandya | All-rounder | India | 24
- Ravi Bishnoi | Bowler | India | 34
- Deepak Hooda | All-rounder | India | 2

---

## Tips & Tricks

✨ **Quick Add Multiple Players:**
1. Add one player
2. See success message
3. Form clears automatically
4. Add next player immediately

🔍 **Check Current Squad:**
- Scroll down in Players tab
- See all players you've added
- Delete if needed

📊 **View Team Stats:**
- Click "Teams" tab in admin panel
- See total players per team
- Count by role

🔐 **Password Help:**
- Default: `admin2025`
- Think of "next year" 😉
- Change in code if needed

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Form won't submit | Make sure all required fields are filled |
| Team dropdown empty | Refresh page and try again |
| Player not showing | Scroll down to "Current Squad" section |
| Wrong role selected | Select from dropdown again before submitting |
| Duplicate name? | System allows duplicate names (different players can have same name) |
| Want to remove player? | Click remove button next to player in Current Squad list |

---

## Features After Adding Players

✅ **Instant UI Update**
- Homepage updates with players immediately
- Team squad displays on team detail page
- Stats recalculate

✅ **Data Management**
- Players stored in-memory (session only)
- Export as XML/JSON anytime
- Clear all data option in Export tab

✅ **View Options**
- Go home to see teams with players
- Click team to see squad
- Go back to admin to export data

---

## What Happens to Data?

📌 **Important:** 
- All player data is stored **in memory only**
- Data resets when you **refresh the page**
- To save permanently, use **Export XML/JSON** feature
- This is for **testing/demo purposes**

---

**Ready to add players? Start now!** 🎉

