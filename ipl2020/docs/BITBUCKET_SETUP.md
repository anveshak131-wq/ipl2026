# Bitbucket Push Setup Guide

## Step 1: Create App Password
1. Go to: https://bitbucket.org/account/settings/app-passwords/
2. Click "Create app password"
3. Name: "Git Push" (or any name)
4. Permissions: Select "Repositories" → "Write"
5. Click "Create"
6. **Copy the password** (you'll only see it once!)

## Step 2: Push Your Code

### Method 1: Using App Password
```bash
git push bitbucket main
# When prompted:
# Username: your-bitbucket-username
# Password: paste-the-app-password-you-created
```

### Method 2: Use App Password in URL
```bash
git remote set-url bitbucket https://YOUR_USERNAME:APP_PASSWORD@bitbucket.org/ipl-cricket-hub/ipl.git
git push bitbucket main
```

## Step 3: Verify Push
```bash
git remote -v
git log bitbucket/main
```

## Your Bitbucket Repository
- **URL**: https://bitbucket.org/ipl-cricket-hub/ipl
- **Workspace**: ipl-cricket-hub
- **Repository**: ipl

