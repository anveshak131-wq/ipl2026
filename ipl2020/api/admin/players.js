/**
 * Vercel Serverless Function: /api/admin/players
 * Handles player data CRUD operations
 * Uses Upstash Redis (automatically configured by Vercel)
 */

import { kv } from '@vercel/kv'

// Initialize KV client (uses Upstash Redis behind the scenes)
const redis = kv;

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

      const players = await redis.get(`players:${team}`);
      
      return res.status(200).json({
        success: true,
        data: players || []
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

      await redis.set(`players:${team}`, players);
      
      return res.status(200).json({
        success: true,
        message: 'Players saved successfully',
        data: players
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

      await redis.del(`players:${team}`);
      
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
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
