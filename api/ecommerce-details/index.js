/**
 * Vercel Serverless Function - Ecommerce Details Collection
 * GET /api/ecommerce-details - Get all entries
 * POST /api/ecommerce-details - Create new entry
 */
import dbConnection from '../../config/database.js';
import EcommerceDetail from '../../models/EcommerceDetail.js';
import { initializeDatabase } from '../../config/initializeDB.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Ensure database connection
    if (!dbConnection.getConnectionStatus()) {
      await dbConnection.connect();
      await initializeDatabase();
    }

    // Handle GET request
    if (req.method === 'GET') {
      return await handleGet(req, res);
    }

    // Handle POST request
    if (req.method === 'POST') {
      return await handlePost(req, res);
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Error in ecommerce-details handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Handle GET request - Fetch all ecommerce details
 * Query params: ?enabled=true|false (optional filter)
 */
async function handleGet(req, res) {
  try {
    const { enabled } = req.query;
    const filter = {};

    // Filter by enabled status if provided
    if (enabled !== undefined) {
      filter.enabled = enabled === 'true';
    }

    const details = await EcommerceDetail.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: details.length,
      data: details,
    });
  } catch (error) {
    console.error('Error fetching ecommerce details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ecommerce details',
      message: error.message,
    });
  }
}

/**
 * Handle POST request - Create new ecommerce detail
 */
async function handlePost(req, res) {
  try {
    const { name, api_version, api_urls, enabled } = req.body;

    // Validate required fields
    if (!name || !api_version) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both "name" and "api_version" are required',
      });
    }

    // Validate api_urls structure if provided
    if (api_urls) {
      for (const [key, value] of Object.entries(api_urls)) {
        if (!value.endpoint || !value.method) {
          return res.status(400).json({
            success: false,
            error: 'Invalid api_urls format',
            message: `Each API URL entry must have 'endpoint' and 'method' properties. Issue with key: ${key}`,
          });
        }

        // Validate HTTP method
        const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
        if (!validMethods.includes(value.method.toUpperCase())) {
          return res.status(400).json({
            success: false,
            error: 'Invalid HTTP method',
            message: `Method must be one of: ${validMethods.join(', ')}`,
          });
        }
      }
    }

    // Create new ecommerce detail
    const newDetail = new EcommerceDetail({
      name,
      api_version,
      api_urls: api_urls || {},
      enabled: enabled !== undefined ? enabled : true,
    });

    await newDetail.save();

    res.status(201).json({
      success: true,
      message: 'Ecommerce detail created successfully',
      data: newDetail,
    });
  } catch (error) {
    console.error('Error creating ecommerce detail:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: 'An ecommerce detail with this name already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create ecommerce detail',
      message: error.message,
    });
  }
}
