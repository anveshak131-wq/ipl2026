# File Upload Feature - Admin Instructions

## Overview
The IPL 2026 website has a secure admin upload system for managing data files. **All uploads go to the backend and are not publicly accessible.** Administrators can upload fixture schedules, player lists, and points tables through the admin interface.

## Accessing the Admin Upload Page
1. Navigate to: `admin-upload.html`
2. Or click "Admin Upload" link in the footer of any page
3. This page is separate from the public website

## Important Notes
- ✅ **Files are stored in backend directory only**
- ✅ **Not accessible to public users**
- ✅ **Requires admin authentication** (in production)
- ✅ **All data is managed server-side**

## Supported File Formats
- **CSV Files** (`.csv`) - Comma-separated values
- **Excel Files** (`.xlsx`, `.xls`) - Microsoft Excel spreadsheets

## Available Upload Functions

### 1. Upload Fixtures
**Location:** Admin Upload Page → Upload Fixtures Section

#### CSV Format:
```csv
Date,Team 1,Team 2,Venue,Time,Status
2026-04-01,RCB,MI,M Chinnaswamy Stadium,19:30,upcoming
2026-04-02,CSK,KKR,MA Chidambaram Stadium,19:30,upcoming
```

#### Column Requirements:
- **Date** - Match date (YYYY-MM-DD format)
- **Team 1** - First team (use short codes: RCB, MI, CSK, etc.)
- **Team 2** - Second team
- **Venue** - Stadium name
- **Time** - Match time (HH:MM format)
- **Status** - Match status: `upcoming`, `live`, or `completed`

### 2. Upload Team Player Lists
**Location:** Admin Upload Page → Upload Team Player Lists Section

Select a team first, then upload a CSV file with player data.

#### CSV Format:
```csv
Name,Role,Age,Nationality,Batting Style,Bowling Style,Image
Virat Kohli,Batsman,35,Indian,Right-handed,Right-arm medium,a.png
AB de Villiers,Wicket-keeper,39,South African,Right-handed,Right-arm medium,abde.png
```

#### Column Requirements:
- **Name** - Player full name
- **Role** - Batsman, Bowler, All-rounder, Wicket-keeper
- **Age** - Numeric value
- **Nationality** - Country name
- **Batting Style** - Right-handed, Left-handed
- **Bowling Style** - Right-arm fast, Left-arm spin, etc. (or "-" if not applicable)
- **Image** - Image filename (stored in team's players folder)

#### Team Selection:
Use the dropdown to select which team you're uploading players for:
- RCB - Royal Challengers Bangalore
- MI - Mumbai Indians
- CSK - Chennai Super Kings
- SRH - Sunrisers Hyderabad
- KXIP - Kings XI Punjab
- KKR - Kolkata Knight Riders
- DC - Delhi Capitals
- RR - Rajasthan Royals
- GT - Gujarat Titans
- LSG - Lucknow Super Giants

### 3. Upload Points Table
**Location:** Admin Upload Page → Upload Points Table Section

#### CSV Format:
```csv
Team,Short Name,Played,Won,Lost,Tied,NRR,Points
Royal Challengers Bangalore,RCB,5,4,1,0,0.523,8
Mumbai Indians,MI,5,4,1,0,0.412,8
```

#### Column Requirements:
- **Team** - Full team name
- **Short Name** - Team abbreviation
- **Played** - Number of matches played (numeric)
- **Won** - Number of wins (numeric)
- **Lost** - Number of losses (numeric)
- **Tied** - Number of tied matches (numeric)
- **NRR** - Net Run Rate (decimal)
- **Points** - Total points (numeric)

## How to Use the Admin Upload

### Step-by-Step Process:
1. **Open Admin Upload Page**
   - Navigate to `admin-upload.html` or click the admin link in footer

2. **Select Upload Type**
   - Choose the type of data you want to upload (Fixtures, Players, or Points)

3. **Prepare Your File**
   - Create or modify your CSV/Excel file following the format requirements

4. **Select File**
   - Click "Choose File" or drag and drop your file

5. **Additional Options** (for player lists)
   - Select the team you're uploading players for

6. **Upload**
   - Click the upload button
   - Wait for success confirmation

7. **Verify Upload**
   - Files are stored in backend directory
   - Data is processed and stored securely

## Team Name Short Codes

Always use these short codes when uploading data:
- `RCB` - Royal Challengers Bangalore
- `MI` - Mumbai Indians
- `CSK` - Chennai Super Kings
- `SRH` - Sunrisers Hyderabad
- `PK` or `KXIP` - Kings XI Punjab
- `KKR` - Kolkata Knight Riders
- `DC` - Delhi Capitals
- `RR` - Rajasthan Royals
- `GT` - Gujarat Titans
- `LSG` - Lucknow Super Giants

## Sample Files

Template files are provided in the project:
- `sample-fixtures.csv` - Example fixture data
- `sample-players.csv` - Example player list data
- `sample-fixtures.csv` - Example points table data

Use these as a starting point for creating your own upload files.

## File Storage

All uploaded files are stored in:
```
/backend/uploaded/
├── fixtures/
├── players/
│   ├── rcb/
│   ├── mi/
│   └── ...
└── points/
```

**Important:** Files are NOT publicly accessible. They are stored securely and processed by the backend system.

## Troubleshooting

### Upload fails?
- Check file format matches requirements exactly
- Verify column headers are spelled correctly
- Ensure commas are used as delimiters in CSV files
- Check file size is reasonable (max 10MB recommended)

### Data not updating on website?
- Files are uploaded to backend
- Website reads from processed data, not raw uploads
- Changes may take a few minutes to propagate
- Check backend processing logs

### Excel files not working?
For full Excel support, the backend uses SheetJS library. Ensure your Excel files:
- Are saved as `.xlsx` format
- Have proper headers in the first row
- Don't contain complex formulas

## Security Notes

- This is an admin-only feature
- In production, add authentication
- Files are validated before processing
- Malformed files are rejected
- Backend logging tracks all uploads

## Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

## Support

For technical support or questions:
- Email: sportsup99@gmail.com
- Include: File format, error message (if any), browser version

---

**Last Updated:** 2026  
**Version:** 2.0  
**Status:** Backend-Only Upload System
