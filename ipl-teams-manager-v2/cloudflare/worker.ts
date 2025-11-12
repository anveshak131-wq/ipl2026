/**
 * Cloudflare Worker - IPL Teams Manager Backend
 * Handles all KV operations for data persistence
 * 
 * File: cloudflare/worker.ts
 * Deploy: wrangler deploy
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for cross-origin requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200,
        headers: corsHeaders 
      });
    }

    try {
      /**
       * GET /api/teams
       * Retrieve all team data from KV storage
       */
      if (request.method === 'GET' && path === '/api/teams') {
        const data = await env.KV_STORE.get('ipl_teams_data');
        
        if (!data) {
          return new Response(
            JSON.stringify({ error: 'No data found' }),
            {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        return new Response(data, {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
        });
      }

      /**
       * POST /api/teams
       * Save/update team data in KV storage
       */
      if (request.method === 'POST' && path === '/api/teams') {
        const body = await request.text();

        if (!body) {
          return new Response(
            JSON.stringify({ error: 'Empty body' }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Store data in KV with 1-year expiration
        await env.KV_STORE.put('ipl_teams_data', body, {
          expirationTtl: 31536000, // 1 year in seconds
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Data saved successfully',
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      /**
       * DELETE /api/teams
       * Clear all data from KV storage
       */
      if (request.method === 'DELETE' && path === '/api/teams') {
        await env.KV_STORE.delete('ipl_teams_data');
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Data cleared successfully',
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      /**
       * Health check endpoint
       */
      if (request.method === 'GET' && path === '/api/health') {
        return new Response(
          JSON.stringify({ 
            status: 'ok',
            service: 'IPL Teams Manager Backend',
            timestamp: new Date().toISOString(),
            kvConnected: true
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      // 404 - Route not found
      return new Response(
        JSON.stringify({ error: 'Not Found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  },
};

interface Env {
  KV_STORE: any; // KVNamespace
}
