/**
 * Vercel Serverless Function - Health Check
 * GET /api/health
 */
import dbConnection from '../config/database.js';

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

  try {
    // Attempt to connect if not already connected
    if (!dbConnection.getConnectionStatus()) {
      await dbConnection.connect();
    }

    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      mongodb: dbConnection.getConnectionStatus() ? 'connected' : 'disconnected',
    });
  } catch (error) {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      mongodb: 'error',
      error: error.message,
    });
  }
}
