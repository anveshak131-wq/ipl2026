/**
 * Vercel Serverless Function: /api/admin/players
 * Handles player data CRUD operations
 * Uses Upstash Redis (automatically configured by Vercel)
 */

import { Redis } from '@upstash/redis'

// Lazy initialization of Redis to avoid errors if env vars not available
let redis = null;

function getRedis() {
  if (!redis) {
    // Check if environment variables are available
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      const missing = [];
      if (!url) missing.push('UPSTASH_REDIS_REST_URL');
      if (!token) missing.push('UPSTASH_REDIS_REST_TOKEN');
      
      throw new Error(
        `Missing environment variables: ${missing.join(', ')}. ` +
        `Please add these to Vercel project settings → Environment Variables and redeploy.`
      );
    }
    
    try {
      redis = Redis.fromEnv();
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
      console.error('Environment check:', {
        UPSTASH_REDIS_REST_URL: url ? 'Set' : 'Missing',
        UPSTASH_REDIS_REST_TOKEN: token ? 'Set' : 'Missing'
      });
      throw new Error(
        `Redis initialization failed: ${error.message}. ` +
        `Check that UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are correctly set in Vercel.`
      );
    }
  }
  return redis;
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

      // Get Redis client
      const redisClient = getRedis();
      
      // Try to get players with normalized team code
      let players = await redisClient.get(`players:${teamCode}`);
      
      // Backward compatibility: if not found with normalized code and original was different, try original
      if (!players && originalTeam !== teamCode) {
        players = await redisClient.get(`players:${originalTeam}`);
        // If found with old key, migrate to new key
        if (players) {
          try {
            await redisClient.set(`players:${teamCode}`, players);
            await redisClient.del(`players:${originalTeam}`);
          } catch (e) {
            // Ignore migration errors
            console.warn('Migration error:', e);
          }
        }
      }
      
      return res.status(200).json({
        success: true,
        data: players || [],
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

      // Get Redis client
      const redisClient = getRedis();
      
      // Normalize team code (handle KXIP -> PBKS mapping)
      let teamCode = team.toUpperCase();
      if (teamCode === 'KXIP') {
        teamCode = 'PBKS';
        // Also delete old KXIP key if it exists (migration)
        try {
          await redisClient.del(`players:KXIP`);
        } catch (e) {
          // Ignore errors
          console.warn('Delete old key error:', e);
        }
      }

      await redisClient.set(`players:${teamCode}`, players);
      
      return res.status(200).json({
        success: true,
        message: 'Players saved successfully',
        data: players,
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

      // Get Redis client
      const redisClient = getRedis();
      
      await redisClient.del(`players:${team}`);
      
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
      code: error.code
    });
    
    // Check if it's an environment variable issue
    const isEnvError = error.message && (
      error.message.includes('UPSTASH_REDIS_REST_URL') ||
      error.message.includes('UPSTASH_REDIS_REST_TOKEN') ||
      error.message.includes('environment variable') ||
      error.message.includes('fromEnv')
    );
    
    // Return a user-friendly error message
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
      hint: isEnvError 
        ? 'Upstash Redis environment variables are not configured. Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel environment variables and redeploy. See VERCEL_UPSTASH_SETUP.md for instructions.'
        : 'Error occurred while accessing Upstash Redis. Check server logs for details.',
      envVarsConfigured: {
        UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN
      }
    });
  }
}
