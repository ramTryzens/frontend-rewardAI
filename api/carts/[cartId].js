/**
 * Vercel Serverless Function - BigCommerce Cart Proxy
 * GET /api/carts/:cartId
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cartId } = req.query;
  const BIGCOMMERCE_API_URL = process.env.BIGCOMMERCE_API_URL;
  const BIGCOMMERCE_TOKEN = process.env.BIGCOMMERCE_TOKEN;

  if (!BIGCOMMERCE_TOKEN) {
    return res.status(500).json({
      error: 'BigCommerce API token not configured. Please set BIGCOMMERCE_TOKEN in your environment variables.',
    });
  }

  try {
    const response = await fetch(`${BIGCOMMERCE_API_URL}/carts/${cartId}`, {
      headers: {
        'X-Auth-Token': BIGCOMMERCE_TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('BigCommerce API Error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Failed to fetch cart: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
