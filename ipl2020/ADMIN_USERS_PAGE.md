# 👤 Admin User Management Page - Complete Guide

## 🎯 Overview

A dedicated admin webpage that displays all registered users with their email addresses and account creation details. This page provides comprehensive user management capabilities for administrators.

## 📁 Files Created

1. **`admin-users.html`** - Main admin user management page
2. **`css/admin-users.css`** - Styling for the admin page
3. **`js/admin-users.js`** - JavaScript functionality

## 🔒 Access & Security

### Admin Login Required
- **URL:** `admin-users.html`
- **Default Credentials:**
  - Username: `admin`
  - Password: `admin123`
- **Session:** 24-hour login session
- **Security:** Client-side authentication (upgrade to backend in production)

⚠️ **Important:** Change default credentials before deployment!

## ✨ Features

### 1. **User Email Collection Display** 📧
- Shows all users who signed in to post comments
- Displays full email addresses
- Never shown to other users (admin-only access)
- Stored locally with full history

### 2. **Detailed User Information** 📊
Each user record shows:
- **Name** - Full name of the user
- **Email Address** - Complete email (e.g., user@example.com)
- **Comment Count** - Number of comments posted
- **Joined Date** - When they first created their account
- **Last Active** - Last time they posted a comment
- **Status** - Active or Blocked
- **Actions** - Block/Unblock, Delete Comments

### 3. **Statistics Dashboard** 📈
Real-time statistics at the top:
- **Total Users** - Count of all registered users
- **Active Users** - Users who can post comments
- **Blocked Users** - Users who are blocked
- **Total Comments** - Sum of all comments posted

### 4. **Search & Filter** 🔍
- **Search Bar** - Find users by name or email
- **Status Filter** - View All / Active Only / Blocked Only
- **Real-time filtering** - Instant results as you type

### 5. **User Management Actions** ⚙️

#### Block User
- Prevents user from posting new comments
- Shows "BLOCKED" status badge
- Can be reversed by unblocking

#### Unblock User
- Restores user's ability to post comments
- Changes status back to "ACTIVE"

#### Delete Comments
- Removes ALL comments from a specific user
- Confirmation required
- Cannot be undone

### 6. **Data Export** 💾
- **Export to CSV** button
- Downloads file with all visible users
- Includes: Name, Email, Comments, Status, Dates
- Filename format: `ipl_users_[timestamp].csv`

### 7. **Quick Links** 🔗
Navigate to:
- Upload Data page
- Live Match Center
- Website Home

## 📊 How It Works

### User Data Collection
1. User signs in on Live Match Updates page
2. Name and email are collected
3. Data stored in `localStorage`
4. Admin can view all collected data
5. Tracks first sign-in (account creation)
6. Tracks last activity

### Data Storage
- **Key:** `live_match_user_comments`
- **Format:** Array of comment objects with author info
- **Includes:** name, email, text, timestamp
- **Blocked Users Key:** `blocked_users`

### Account Creation Tracking
- **First Comment** = Account Creation Date
- System tracks earliest timestamp per email
- Shows as "Joined Date" in admin panel

## 🚀 How to Use

### Step 1: Access the Page
```
Open: admin-users.html in your browser
```

### Step 2: Login
```
Username: admin
Password: admin123
```

### Step 3: View Users
- Dashboard loads automatically after login
- See all statistics at the top
- Scroll down to view the users table

### Step 4: Manage Users

**To Block a User:**
1. Find user in the table
2. Click "Block" button
3. Confirm the action
4. User status changes to "BLOCKED"

**To Unblock a User:**
1. Find blocked user (red background)
2. Click "Unblock" button
3. Confirm the action
4. User status changes to "ACTIVE"

**To Delete User Comments:**
1. Click "Delete Comments" button for any user
2. Confirm deletion (cannot be undone)
3. All comments from that user are removed

### Step 5: Search & Filter

**Search:**
```
Type in search box: "john" or "john@example.com"
Results filter instantly
```

**Filter by Status:**
```
Select from dropdown:
- All Users (default)
- Active Only
- Blocked Only
```

### Step 6: Export Data

**Export to CSV:**
1. Click "Export CSV" button
2. File downloads automatically
3. Open in Excel/Google Sheets
4. Contains all visible users (respects filters)

## 📋 CSV Export Format

```csv
Name,Email,Comments,Status,Joined Date,Last Active
"John Doe","john@example.com",5,"Active","Nov 1, 2025, 10:30 AM","Nov 2, 2025, 1:45 AM"
"Jane Smith","jane@example.com",3,"Blocked","Nov 1, 2025, 11:20 AM","Nov 1, 2025, 3:15 PM"
```

## 🔗 Integration with Other Pages

### From Admin Upload Panel
- Green "User Management" button in navigation
- Direct link to `admin-users.html`

### From Live Match Updates
- Users sign in to post comments
- Their emails are automatically collected
- Visible only in admin users page

### Data Flow
```
User signs in → Email collected → Stored locally → 
Admin views in admin-users.html → Admin can manage users
```

## 📱 Responsive Design

✅ **Desktop** - Full table view with all columns
✅ **Tablet** - Scrollable table, stacked buttons
✅ **Mobile** - Horizontal scroll for table, vertical buttons

## 🎨 Visual Features

### Color-Coded Status
- **Green Badge** - Active users
- **Red Badge** - Blocked users
- **Red Row Background** - Blocked user rows

### Icons
- 👥 Users
- ✅ Active status
- 🚫 Blocked status
- 💬 Comments count
- 📅 Calendar for dates
- 🔒 Lock for admin access

### Animations
- Smooth hover effects on cards
- Toast notifications for actions
- Loading spinner while data loads
- Fade-in effects for modal

## ⚠️ Important Notes

### Privacy & Security
1. **Emails are private** - Only admins can see them
2. **Not visible to users** - Users don't see other emails
3. **Secure storage** - LocalStorage (upgrade to backend recommended)
4. **Admin authentication** - Required to access page

### Data Management
1. **Persistent storage** - Data stays until cleared
2. **No automatic deletion** - Manual management required
3. **Backup recommended** - Export CSV regularly
4. **No data recovery** - Deleted comments are permanent

### Best Practices
1. ✅ Export emails regularly for backup
2. ✅ Review blocked users periodically
3. ✅ Monitor comment counts for abuse
4. ✅ Keep admin credentials secure
5. ✅ Use backend authentication in production

## 🔧 Customization

### Change Admin Credentials
Edit `js/admin-users.js`:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'your_username',
    password: 'your_secure_password'
};
```

### Modify Session Duration
Default: 24 hours. Change in `isAdminLoggedIn()`:
```javascript
if (sessionAge < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
```

### Add More User Fields
1. Collect additional data during sign-in
2. Update display in `displayUsers()` function
3. Add columns to table HTML
4. Update CSV export format

## 🚀 Production Recommendations

### Use Python Backend
Instead of localStorage, integrate with the Python backend:

```javascript
// Replace localStorage calls with API calls
const users = await fetch('http://localhost:5000/api/admin/users', {
    headers: { 'Authorization': 'Bearer ' + token }
});
```

### Implement Real Authentication
- JWT tokens
- Server-side session management
- Password hashing
- Role-based access control

### Add Features
- Email verification
- User roles (admin, moderator, user)
- Bulk actions (block multiple users)
- Advanced search (by date range, comment count)
- Email notifications to users
- Activity logs

## 📊 Example Use Cases

### Use Case 1: Export Email List for Newsletter
1. Open admin-users.html
2. Login as admin
3. Click "Export CSV"
4. Import to email marketing tool

### Use Case 2: Block Spam User
1. Notice user posting spam comments
2. Search for user by email
3. Click "Block" button
4. User can no longer post comments

### Use Case 3: Moderate Comments
1. Review users by comment count
2. Check high-volume commenters
3. Delete comments if inappropriate
4. Block user if necessary

### Use Case 4: User Activity Report
1. Filter "Active Only"
2. Sort by "Last Active"
3. Export to CSV
4. Analyze engagement patterns

## 🎯 Summary

The Admin User Management page provides:

✅ **Complete email collection** - All user emails in one place
✅ **Account creation tracking** - See when users joined
✅ **Comprehensive management** - Block, unblock, delete
✅ **Easy export** - Download CSV anytime
✅ **Search & filter** - Find users quickly
✅ **Real-time stats** - Monitor user activity
✅ **Secure access** - Admin login required
✅ **Professional UI** - Modern, responsive design

---

**Access the page:** `admin-users.html`  
**Default login:** admin / admin123  
**Purpose:** Manage all registered users and their emails

© 2026 IPL Analytics Dashboard - Admin User Management
