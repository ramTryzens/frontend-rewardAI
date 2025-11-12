/**
 * Vercel Serverless Function - Rules Collection
 * GET /api/rules - Get all rules
 * POST /api/rules - Create new rule
 */
import dbConnection from '../../config/database.js';
import RuleEntry from '../../models/RuleEntry.js';
import { initializeRules } from '../../config/initializeRules.js';

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
      await initializeRules();
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
    console.error('Error in rules handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Handle GET request - Fetch all rules
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

    const rules = await RuleEntry.find(filter).sort({ id: 1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    console.error('Error fetching rules:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rules',
      message: error.message,
    });
  }
}

/**
 * Handle POST request - Create new rule
 */
async function handlePost(req, res) {
  try {
    const { id, key, enabled } = req.body;

    // Validate required fields
    if (id === undefined || id === null || !key) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Both "id" (numeric) and "key" are required',
      });
    }

    // Validate id is a number
    if (typeof id !== 'number' || !Number.isInteger(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid id format',
        message: 'The "id" field must be an integer',
      });
    }

    // Check if rule with this numeric id already exists
    const existingRule = await RuleEntry.findOne({ id });
    if (existingRule) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate entry',
        message: `A rule with id ${id} already exists`,
      });
    }

    // Create new rule entry
    const newRule = new RuleEntry({
      id,
      key,
      enabled: enabled !== undefined ? enabled : true,
    });

    await newRule.save();

    res.status(201).json({
      success: true,
      message: 'Rule created successfully',
      data: newRule,
    });
  } catch (error) {
    console.error('Error creating rule:', error);

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
        message: 'A rule with this id already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create rule',
      message: error.message,
    });
  }
}
