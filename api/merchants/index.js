/**
 * Vercel Serverless Function - Merchants Collection
 * GET /api/merchants - Get all merchants
 * POST /api/merchants - Create new merchant
 */
import dbConnection from '../../config/database.js';
import { initializeDatabase } from '../../config/initializeDB.js';
import { initializeRules } from '../../config/initializeRules.js';
import Merchant from '../../models/Merchant.js';

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
    // Ensure database connection and initialization
    if (!dbConnection.getConnectionStatus()) {
      await dbConnection.connect();
      await initializeDatabase();
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
    console.error('Error in merchants handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Handle GET request - Fetch all merchants
 */
async function handleGet(req, res) {
  try {
    const merchants = await Merchant.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: merchants.length,
      data: merchants,
    });
  } catch (error) {
    console.error('Error fetching merchants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchants',
      message: error.message,
    });
  }
}

/**
 * Handle POST request - Create new merchant
 */
async function handlePost(req, res) {
  try {
    const { name, ecomDetails, businessRules } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'Merchant name is required',
      });
    }

    if (!ecomDetails || !ecomDetails.platform || !ecomDetails.accessKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'ecomDetails.platform and ecomDetails.accessKey are required',
      });
    }

    if (!businessRules || typeof businessRules !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'businessRules object is required',
      });
    }

    // Validate that the platform exists in ecommerce_details
    const platformExists = await Merchant.validatePlatform(ecomDetails.platform);
    if (!platformExists) {
      return res.status(400).json({
        success: false,
        error: 'Invalid platform',
        message: `Platform "${ecomDetails.platform}" does not exist in ecommerce_details collection`,
      });
    }

    // Validate business rule keys
    const ruleValidation = await Merchant.validateBusinessRules(businessRules);
    if (!ruleValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid business rules',
        message: ruleValidation.message,
        invalidKeys: ruleValidation.invalidKeys,
      });
    }

    // Validate business rule values
    const valueValidation = Merchant.validateBusinessRuleValues(businessRules);
    if (!valueValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid business rule values',
        message: valueValidation.errors.join('; '),
      });
    }

    // Create new merchant
    const newMerchant = new Merchant({
      name,
      ecomDetails,
      businessRules,
    });

    await newMerchant.save();

    res.status(201).json({
      success: true,
      message: 'Merchant created successfully',
      data: newMerchant,
    });
  } catch (error) {
    console.error('Error creating merchant:', error);

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
        message: 'A merchant with this name may already exist',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create merchant',
      message: error.message,
    });
  }
}
