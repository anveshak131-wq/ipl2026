# Server-Side Player Modal Setup Guide

## Overview
This solution uses **PHP and Python** to render player modal HTML on the server, eliminating complex JavaScript dependencies. The modal HTML is generated server-side and simply loaded by the browser.

## Why Server-Side?
- ✅ **More Reliable**: Server-side rendering doesn't depend on browser JavaScript execution
- ✅ **Faster**: HTML is pre-rendered, reducing client-side processing
- ✅ **Simpler**: Minimal JavaScript - just load and display
- ✅ **Fallback Support**: Multiple endpoints (PHP → Python → JavaScript)

## Files Created

### 1. PHP Endpoint
- **File**: `api/player-modal.php`
- **Usage**: `api/player-modal.php?team=RCB&player=PlayerName`
- **Returns**: Complete HTML for player modal

### 2. Python Endpoint
- **File**: `api/player-modal.py`
- **Usage**: `http://localhost:5001/api/player-modal?team=RCB&player=PlayerName`
- **Returns**: Complete HTML for player modal

### 3. Simple JavaScript Loader
- **File**: `js/player-modal-server.js`
- **Purpose**: Loads HTML from PHP/Python and displays it
- **Fallback**: Falls back to client-side rendering if server endpoints fail

## Setup Instructions

### Option 1: PHP (Easiest - Works on most web servers)

1. **Ensure PHP is enabled** on your web server
2. **No additional setup required** - PHP endpoint works immediately
3. **Test**: Visit `http://yourdomain.com/api/player-modal.php?team=RCB&player=Virat%20Kohli`

### Option 2: Python (More control)

1. **Install Flask**:
   ```bash
   pip install flask requests
   ```

2. **Run the Python server**:
   ```bash
   cd api
   python player-modal.py
   ```
   Server runs on `http://localhost:5001`

3. **For production**, use a WSGI server like Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5001 player-modal:app
   ```

4. **Test**: Visit `http://localhost:5001/api/player-modal?team=RCB&player=Virat%20Kohli`

### Option 3: Both (Recommended)

Run both PHP and Python for maximum reliability:
- PHP handles requests automatically (if web server supports it)
- Python runs as a separate service on port 5001
- JavaScript tries PHP first, then Python, then falls back to client-side

## How It Works

1. **User clicks player card** → JavaScript calls `PlayerModalServer.show(playerName, team)`
2. **JavaScript fetches HTML** from PHP or Python endpoint
3. **Server renders HTML** using player data from Vercel API
4. **HTML is inserted** into modal and displayed
5. **No complex JavaScript** - just load and show!

## API Endpoints

### PHP Endpoint
```
GET /api/player-modal.php?team=RCB&player=PlayerName
```

### Python Endpoint
```
GET http://localhost:5001/api/player-modal?team=RCB&player=PlayerName
```

### Parameters
- `team` (required): Team code (e.g., RCB, MI, CSK)
- `player` (required): Player name (URL encoded)

### Response
Returns HTML fragment that can be inserted directly into the modal content area.

## Deployment

### For PHP:
- Just upload `api/player-modal.php` to your web server
- Ensure PHP is enabled
- That's it!

### For Python:
- Install Flask and requests: `pip install flask requests`
- Run with Gunicorn in production: `gunicorn -w 4 -b 0.0.0.0:5001 player-modal:app`
- Or use systemd service for auto-start
- Configure reverse proxy (nginx/Apache) if needed

### For Vercel/Netlify:
- PHP endpoints work automatically on Vercel
- Python endpoints need serverless functions (see `api/` directory structure)

## Troubleshooting

### PHP endpoint not working
1. Check if PHP is enabled on your server
2. Check file permissions: `chmod 644 api/player-modal.php`
3. Check PHP error logs
4. Test with: `php api/player-modal.php` (should show usage)

### Python endpoint not working
1. Check if Flask is installed: `pip list | grep Flask`
2. Check if port 5001 is available: `lsof -i :5001`
3. Check Python version: `python --version` (needs Python 3.6+)
4. Check server logs for errors

### Modal not showing
1. Check browser console for errors
2. Verify endpoint is accessible (test URL directly)
3. Check CORS headers (should allow all origins)
4. Verify player name matches exactly (case-insensitive)

### Player data not loading
1. Check Vercel API is accessible
2. Verify team code is correct (uppercase)
3. Check player name spelling
4. Verify Vercel API returns data for that team

## Benefits Over JavaScript-Only Solution

1. **Reliability**: Server-side rendering is more reliable than client-side
2. **Performance**: Pre-rendered HTML loads faster
3. **Simplicity**: Less JavaScript = fewer bugs
4. **SEO**: Server-rendered content is better for SEO
5. **Debugging**: Easier to debug server-side code
6. **Caching**: Server can cache rendered HTML
7. **Security**: Sensitive logic stays on server

## Fallback Chain

The system tries endpoints in this order:
1. **PHP endpoint** (`api/player-modal.php`) - Fastest, most common
2. **Python endpoint** (`http://localhost:5001/api/player-modal`) - More control
3. **Client-side JavaScript** (`player-modal-new.js`) - Last resort

This ensures the modal always works, even if one endpoint fails.

## Testing

### Test PHP endpoint:
```bash
curl "http://yourdomain.com/api/player-modal.php?team=RCB&player=Virat%20Kohli"
```

### Test Python endpoint:
```bash
curl "http://localhost:5001/api/player-modal?team=RCB&player=Virat%20Kohli"
```

### Test in browser:
1. Open team page (e.g., `rcb.html`)
2. Click on any player card
3. Modal should open with player details
4. Check browser console for which endpoint was used

## Next Steps

1. **Update all team pages** to use server-side modal (currently only `rcb.html` is updated)
2. **Configure Python service** to run automatically (systemd/service)
3. **Add caching** to reduce API calls
4. **Monitor performance** and optimize as needed
5. **Add error logging** for better debugging

## Support

If you encounter issues:
1. Check server logs (PHP error log, Python console)
2. Check browser console for JavaScript errors
3. Test endpoints directly with curl or browser
4. Verify Vercel API is accessible
5. Check network tab for failed requests

