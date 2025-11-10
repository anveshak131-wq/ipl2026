# IPL 2026 Admin Manual Data Entry Instructions

## Overview
- All data entry for players, fixtures, and points table is **manual only**. No file/CSV upload is supported.
- All changes are saved to your browser's localStorage and reflected on the website frontend.
- You can add, edit, or delete players, fixtures, and points table rows at any time. Changes persist until you edit or delete them.

## Players Entry
- Select a team, then add players using the manual form.
- **Nationality** and **Bowling Style** are dropdowns with common options (no free text for Nationality).
- If you select **Other** for Bowling Style, an additional box appears to specify the exact style. This value will be saved and shown as the player's bowling style.
- You can set Captain, Vice-Captain, and Wicket-Keeper status for each player.
- Foreign players are automatically detected (any nationality except Indian/India) and shown with a 🌍 symbol.
- Duplicate players for a team are prevented (deduplication by normalized name).
- Batting and bowling styles are shown only when a player is clicked.

## Fixtures Entry
- Add fixtures manually using the form. All fields are required.
- Edit or delete fixtures at any time. Changes are saved instantly.

## Points Table Entry
- Add, edit, or delete points table rows manually.

## Data Management
- All data is stored in your browser (localStorage) and will persist until you clear it or edit/delete entries.
- No file upload or download is available.

## Important
- If you clear your browser storage, all manually entered data will be lost.
- For any issues, refer to the README or contact the site maintainer.

## Team Name Short Codes

Always use these short codes when entering data:
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

## Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

## Support

For technical support or questions:
- Email: sportsup99@gmail.com
- Include: Error message (if any), browser version

---

**Last Updated:** 2026-10-28  
**Version:** 2.1  
**Status:** Manual Data Entry System with Admin Preview/Edit
