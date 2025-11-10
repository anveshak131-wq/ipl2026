# GitLab Push Guide

## ✅ GitLab Remote Configured!

**Repository**: https://gitlab.com/anveshak131-wq-group/anveshak131-wq-project

## How to Push

### Option 1: Interactive Push (Recommended)

1. Open terminal
2. Navigate to project:
   ```bash
   cd /Users/anvesh/Downloads/ipl2020
   ```

3. Push to GitLab:
   ```bash
   git push gitlab main
   ```

4. When prompted:
   - **Username**: `anveshak131-wq` (your GitLab username)
   - **Password**: Your GitLab account password OR Personal Access Token

### Option 2: Create Personal Access Token (More Secure)

**Step 1: Create Token**
1. Go to: https://gitlab.com/-/profile/personal_access_tokens
2. Click "Add new token"
3. Fill in:
   - **Token name**: "Git Push" (or any name)
   - **Expiration date**: Choose (or leave blank for no expiration)
   - **Select scopes**: ✅ Check "write_repository"
4. Click "Create personal access token"
5. **Copy the token immediately** (you'll only see it once!)

**Step 2: Push with Token**

Option A: Use token as password (interactive)
```bash
git push gitlab main
# Username: anveshak131-wq
# Password: paste-your-token-here
```

Option B: Use token in URL
```bash
git remote set-url gitlab https://anveshak131-wq:YOUR_TOKEN@gitlab.com/anveshak131-wq-group/anveshak131-wq-project.git
git push gitlab main
```

### Option 3: Use SSH (Most Secure)

**Step 1: Generate SSH Key (if you don't have one)**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Press Enter for no passphrase (or set one)
```

**Step 2: Add SSH Key to GitLab**
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. Go to: https://gitlab.com/-/profile/keys
3. Click "Add new key"
4. Paste your public key
5. Click "Add key"

**Step 3: Change Remote to SSH**
```bash
git remote set-url gitlab git@gitlab.com:anveshak131-wq-group/anveshak131-wq-project.git
git push gitlab main
```

## Quick Push (Right Now)

**Easiest method:**
```bash
cd /Users/anvesh/Downloads/ipl2020
git push gitlab main
```

When prompted:
- **Username**: `anveshak131-wq`
- **Password**: Your GitLab password OR create a Personal Access Token

## Verify Push

After pushing:
```bash
git log gitlab/main
git ls-remote gitlab
```

## Your Repository

- **URL**: https://gitlab.com/anveshak131-wq-group/anveshak131-wq-project
- **Remote**: `gitlab → https://gitlab.com/anveshak131-wq-group/anveshak131-wq-project.git`

## Enable GitLab Pages (Optional - Free Hosting)

After pushing:
1. Go to: https://gitlab.com/anveshak131-wq-group/anveshak131-wq-project/-/settings/pages
2. Configure Pages settings
3. Your site will be at: `anveshak131-wq-group.gitlab.io/anveshak131-wq-project`

---

## Troubleshooting

### If authentication fails:
1. **Verify username**: Should be `anveshak131-wq`
2. **Use Personal Access Token**: More reliable than password
3. **Check token permissions**: Must have `write_repository` scope

### If push is rejected:
- Repository might need initialization
- Try: `git push -u gitlab main --force` (if repository is empty)

