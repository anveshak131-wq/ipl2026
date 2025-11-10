/**
 * Vercel Serverless Function: /api/admin/players
 * Handles player data CRUD operations
 * Uses @vercel/kv with graceful fallback if not configured
 */

// Lazy load KV to avoid errors if not configured
let kv = null;
let kvInitialized = false;
let kvAvailable = false;

async function initializeKV() {
  if (kvInitialized) {
    return kvAvailable;
  }
  
  kvInitialized = true;
  
  try {
    // Check if KV environment variables are present
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log('Vercel KV not configured - environment variables missing');
      kvAvailable = false;
      return false;
    }
    
    // Try to import and initialize KV
    const kvModule = await import('@vercel/kv');
    kv = kvModule.kv;
    
    // Test if KV is working by trying a simple operation
    // (We'll catch errors in actual operations, so just mark as available)
    kvAvailable = true;
    console.log('Vercel KV initialized successfully');
    return true;
  } catch (error) {
    console.warn('Vercel KV initialization failed:', error.message);
    kvAvailable = false;
    kv = null;
    return false;
  }
}

// In-memory fallback storage (per instance, not persistent across deployments)
const fallbackStorage = new Map();

// Helper to get data (try KV first, then fallback)
async function getData(key) {
  // Initialize KV if not already done
  await initializeKV();
  
  if (kvAvailable && kv) {
    try {
      const data = await kv.get(key);
      if (data !== null && data !== undefined) {
        // Also cache in fallback for faster access
        fallbackStorage.set(key, data);
        return data;
      }
    } catch (error) {
      console.error(`KV get error for ${key}:`, error.message);
      // Fall through to fallback
    }
  }
  
  // Fallback to in-memory storage
  return fallbackStorage.get(key) || null;
}

// Helper to set data (try KV first, then fallback)
async function setData(key, value) {
  // Initialize KV if not already done
  await initializeKV();
  
  let storageType = 'memory-fallback';
  
  if (kvAvailable && kv) {
    try {
      await kv.set(key, value);
      storageType = 'vercel-kv';
    } catch (error) {
      console.error(`KV set error for ${key}:`, error.message);
      storageType = 'memory-fallback';
    }
  }
  
  // Always update fallback cache
  fallbackStorage.set(key, value);
  
  return { success: true, storage: storageType };
}

// Helper to delete data
async function deleteData(key) {
  // Initialize KV if not already done
  await initializeKV();
  
  if (kvAvailable && kv) {
    try {
      await kv.del(key);
    } catch (error) {
      console.error(`KV del error for ${key}:`, error.message);
    }
  }
  fallbackStorage.delete(key);
  return true;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET - Fetch players for a team
    if (req.method === 'GET') {
      const { team } = req.query;
      
      if (!team) {
        return res.status(400).json({
          success: false,
          error: 'Team parameter is required'
        });
      }

      // Normalize team code (handle KXIP -> PBKS mapping for backward compatibility)
      let teamCode = team.toUpperCase();
      const originalTeam = teamCode;
      
      // Map KXIP to PBKS (Punjab Kings renamed)
      if (teamCode === 'KXIP') {
        teamCode = 'PBKS';
      }

      // Try to get players with normalized team code
      let players = await getData(`players:${teamCode}`);
      
      // Backward compatibility: if not found with normalized code and original was different, try original
      if (!players && originalTeam !== teamCode) {
        players = await getData(`players:${originalTeam}`);
        // If found with old key, migrate to new key
        if (players) {
          try {
            await setData(`players:${teamCode}`, players);
            await deleteData(`players:${originalTeam}`);
          } catch (e) {
            // Ignore migration errors
            console.warn('Migration error:', e);
          }
        }
      }
      
      // Initialize KV to check availability
      await initializeKV();
      const storageType = kvAvailable ? 'vercel-kv' : 'memory-fallback';
      
      return res.status(200).json({
        success: true,
        data: players || [],
        storage: storageType,
        count: Array.isArray(players) ? players.length : 0
      });
    }

    // POST - Save players for a team
    if (req.method === 'POST') {
      const { team, players } = req.body;
      
      if (!team || !players) {
        return res.status(400).json({
          success: false,
          error: 'Team and players are required'
        });
      }

      // Normalize team code (handle KXIP -> PBKS mapping)
      let teamCode = team.toUpperCase();
      if (teamCode === 'KXIP') {
        teamCode = 'PBKS';
        // Also delete old KXIP key if it exists (migration)
        try {
          await deleteData(`players:KXIP`);
        } catch (e) {
          // Ignore errors
          console.warn('Delete old key error:', e);
        }
      }

      const saved = await setData(`players:${teamCode}`, players);
      const storageType = saved.storage;
      const warning = storageType === 'memory-fallback' ? ' (Using temporary storage - configure Vercel KV for persistence)' : '';
      
      return res.status(200).json({
        success: true,
        message: `Players saved successfully${warning}`,
        data: players,
        storage: storageType,
        count: players.length
      });
    }

    // DELETE - Delete players for a team
    if (req.method === 'DELETE') {
      const { team } = req.query;
      
      if (!team) {
        return res.status(400).json({
          success: false,
          error: 'Team parameter is required'
        });
      }

      await deleteData(`players:${team}`);
      
      return res.status(200).json({
        success: true,
        message: 'Players deleted successfully'
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('API Error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      kvConfigured: kvAvailable,
      envVars: {
        KV_REST_API_URL: !!process.env.KV_REST_API_URL,
        KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN
      }
    });
    
    // Return a user-friendly error message
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      hint: kvAvailable 
        ? 'Error occurred while accessing Vercel KV. Check server logs for details.'
        : 'Vercel KV is not configured. The API is using fallback storage. Configure Vercel KV for persistent storage.',
      storage: kvAvailable ? 'vercel-kv' : 'memory-fallback',
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name,
        code: error.code
      } : undefined
    });
  }
}
