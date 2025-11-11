# Bitbucket Authentication Fix

## Issue
Authentication failing when pushing to Bitbucket

## Solution Steps

### Step 1: Verify App Password Permissions
1. Go to: https://bitbucket.org/account/settings/app-passwords/
2. Find your App Password
3. **Critical**: Make sure it has these permissions:
   - ✅ **Repositories: Write** (must be checked)
   - ✅ **Repositories: Read** (should also be checked)

### Step 2: Try Manual Push
Run this command in terminal:
```bash
cd /Users/anvesh/Downloads/ipl2020
git push https://iplcrickethub-admin:YOUR_APP_PASSWORD@bitbucket.org/ipl-cricket-hub/ipl.git main
```

Replace `YOUR_APP_PASSWORD` with your actual App Password.

### Step 3: Alternative - Use Bitbucket Desktop Client
1. Download Bitbucket Sourcetree: https://www.sourcetreeapp.com/
2. Or use any Git GUI client
3. Add repository
4. Push from GUI (easier for authentication)

### Step 4: Alternative - Upload via Web Interface
1. Go to: https://bitbucket.org/ipl-cricket-hub/ipl
2. Click "Upload file" (if available)
3. Upload your files directly

### Step 5: Create New App Password
If current one doesn't work:
1. Go to: https://bitbucket.org/account/settings/app-passwords/
2. Delete old App Password
3. Create new one:
   - Name: "Git Push"
   - Permissions: **Repositories: Write**
4. Copy new password immediately
5. Try push again

### Step 6: Verify Username
Make sure you're using the correct username:
- Username: `iplcrickethub-admin`
- This should match the account that created the App Password

## Quick Test
Try this to test authentication:
```bash
curl -u iplcrickethub-admin:YOUR_APP_PASSWORD https://api.bitbucket.org/2.0/user
```

If this works, authentication is correct. If not, the App Password is invalid.

