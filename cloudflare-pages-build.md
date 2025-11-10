# Cloudflare Pages Build Configuration

## Build Settings for Cloudflare Pages

When setting up your project on Cloudflare Pages, use these settings:

### Build Configuration:
- **Framework preset**: None (or Static)
- **Build command**: (leave empty) OR `npm run build`
- **Build output directory**: `.` (root directory)
- **Root directory**: (leave empty) OR `/` if your files are in a subdirectory

### Environment Variables:
- None required for static hosting

### Node Version:
- Use default (or Node.js 18+)

---

## Quick Fix for Build Errors

If you're getting build errors:

1. **Remove Vercel dependencies** (optional, for cleaner build):
   - The `vercel` package in devDependencies is not needed for Cloudflare
   - But it won't break the build if left there

2. **Use these build settings**:
   - Build command: `echo "Build complete"` OR leave empty
   - Output directory: `.`

3. **Alternative**: Create a minimal `package.json` for Cloudflare:
   - Remove `vercel` from devDependencies
   - Keep only `@upstash/redis` if you plan to use it later

---

## Recommended Settings

**Framework**: None  
**Build command**: (empty)  
**Output directory**: `.`  
**Root directory**: (empty)

This will deploy your static files directly without any build process.

