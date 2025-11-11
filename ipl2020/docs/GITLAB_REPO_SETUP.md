# GitLab Repository Setup Guide

## Issue: 404 Page Not Found

This means the repository URL might be incorrect or the repository doesn't exist yet.

## Step 1: Verify Your GitLab Repository

### Find Your Correct Repository URL:

1. **Go to GitLab**: https://gitlab.com
2. **Sign in** to your account
3. **Check your projects**:
   - Click your profile icon → "Your projects"
   - OR go to: https://gitlab.com/dashboard/projects

4. **Find or Create Repository**:
   - If you have a repository, click on it
   - If you don't, create a new one:
     - Click "New project" or "Create project"
     - Choose "Create blank project"
     - Project name: `ipl-cricket-hub` (or any name)
     - Visibility: Public or Private (your choice)
     - Click "Create project"

5. **Copy the Clone URL**:
   - On your project page, click the blue "Clone" button
   - Copy the **HTTPS** URL
   - It should look like: `https://gitlab.com/username/project-name.git`
   - OR: `https://gitlab.com/group-name/project-name.git`

## Step 2: Configure the Correct Remote

### Option A: If Repository Exists

**Get the correct URL from GitLab, then:**

```bash
cd /Users/anvesh/Downloads/ipl2020

# Remove old remote (if exists)
git remote remove gitlab 2>&1 || echo "No existing remote"

# Add correct remote
git remote add gitlab https://gitlab.com/YOUR-USERNAME/YOUR-PROJECT-NAME.git

# Verify
git remote -v | grep gitlab
```

**Replace:**
- `YOUR-USERNAME` with your GitLab username
- `YOUR-PROJECT-NAME` with your project name

### Option B: Create New Repository First

1. **Go to GitLab**: https://gitlab.com
2. **Click "New project"** or "Create project"
3. **Fill in**:
   - Project name: `ipl-cricket-hub`
   - Project slug: (auto-generated)
   - Visibility level: Public or Private
4. **Click "Create project"**
5. **Copy the clone URL** from the project page
6. **Use that URL** in the git remote command

## Step 3: Common Repository URL Formats

### Format 1: Personal Repository
```
https://gitlab.com/anveshak131-wq/ipl-cricket-hub.git
```

### Format 2: Group Repository
```
https://gitlab.com/anveshak131-wq-group/ipl-cricket-hub.git
```

### Format 3: Subgroup Repository
```
https://gitlab.com/group/subgroup/project.git
```

## Step 4: Push Your Code

Once you have the correct URL:

```bash
cd /Users/anvesh/Downloads/ipl2020

# Configure remote with correct URL
git remote add gitlab https://gitlab.com/YOUR-USERNAME/YOUR-PROJECT.git

# Push to GitLab
git push gitlab main
```

When prompted:
- **Username**: Your GitLab username
- **Password**: Your GitLab password OR Personal Access Token

## Troubleshooting

### If 404 persists:

1. **Check repository visibility**:
   - Make sure repository is Public, OR
   - Make sure you have access if it's Private

2. **Verify URL format**:
   - Should end with `.git`
   - No trailing slashes
   - Correct username/group name

3. **Create new repository**:
   - Sometimes easier to create fresh repository
   - Then push to it

4. **Check your GitLab username**:
   - Go to: https://gitlab.com/-/profile
   - Verify your username matches the URL

## Quick Test

To test if repository exists:
```bash
# Try to fetch (will show error if doesn't exist)
git fetch gitlab 2>&1
```

## Alternative: Create Repository via GitLab UI

1. Go to: https://gitlab.com/projects/new
2. Create blank project
3. Name it: `ipl-cricket-hub`
4. Copy the clone URL
5. Use that URL to configure remote

---

## What's Your GitLab Username?

To find your correct URL, I need to know:
- Your GitLab username (e.g., `anveshak131-wq`)
- The exact repository name you want to use

Then I can configure the correct remote URL for you!

