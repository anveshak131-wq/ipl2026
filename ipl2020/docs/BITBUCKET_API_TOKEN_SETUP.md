# Bitbucket API Token Setup (Updated 2025)

## Important: App Passwords Deprecated
- ✅ **App Passwords** - No longer available (deprecated Sept 9, 2025)
- ✅ **API Tokens** - Now required for authentication

## Step 1: Create API Token
1. Go to: https://bitbucket.org/account/settings/api-tokens/
2. Click "Create token"
3. Fill in:
   - **Label**: "Git Push" (or any name)
   - **Permissions**: 
     - ✅ **Repositories: Write** (required for push)
     - ✅ **Repositories: Read** (recommended)
4. Click "Create"
5. **Copy the token immediately** - you'll only see it once!

## Step 2: Push Using API Token

### Method 1: Using Token in URL
```bash
cd /Users/anvesh/Downloads/ipl2020
git remote set-url bitbucket https://iplcrickethub-admin:YOUR_API_TOKEN@bitbucket.org/ipl-cricket-hub/ipl.git
git push bitbucket main
```

### Method 2: Interactive Push
```bash
cd /Users/anvesh/Downloads/ipl2020
git push bitbucket main
```
When prompted:
- **Username**: `iplcrickethub-admin`
- **Password**: Paste your **API Token** (not your account password)

### Method 3: Using x-token-auth (Recommended)
```bash
git remote set-url bitbucket https://x-token-auth:YOUR_API_TOKEN@bitbucket.org/ipl-cricket-hub/ipl.git
git push bitbucket main
```

## Step 3: Verify Push
```bash
git log bitbucket/main
git ls-remote bitbucket
```

## Your Repository
- **URL**: https://bitbucket.org/ipl-cricket-hub/ipl
- **Workspace**: ipl-cricket-hub
- **Repository**: ipl

## Note
API tokens are more secure than App Passwords and provide better control over permissions.

