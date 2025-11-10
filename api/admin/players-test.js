/**
 * Test endpoint to verify API routing works
 * This doesn't use Redis - just returns a simple response
 */

export default async function handler(req, res) {
  console.log('=== TEST ENDPOINT CALLED ===');
  console.log('Method:', req.method);
  console.log('Query:', req.query);
  
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    return res.status(200).json({
      success: true,
      message: 'Test endpoint is working!',
      method: req.method,
      query: req.query,
      envVars: {
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'Set' : 'Missing',
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

