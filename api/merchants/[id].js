/**
 * Vercel Serverless Function - Update or Delete Merchant by MongoDB _id
 * PATCH /api/merchants/:id
 * DELETE /api/merchants/:id
 */
import mongoose from 'mongoose';
import dbConnection from '../../config/database.js';
import Merchant from '../../models/Merchant.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Get MongoDB _id from query params (Vercel dynamic route)
  const { id } = req.query;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'The provided ID is not a valid MongoDB ObjectId',
    });
  }

  try {
    // Ensure database connection
    if (!dbConnection.getConnectionStatus()) {
      await dbConnection.connect();
    }

    // Handle PATCH request (Update)
    if (req.method === 'PATCH') {
      return await handlePatch(req, res, id);
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
      return await handleDelete(req, res, id);
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
 * Handle PATCH request - Update merchant
 */
async function handlePatch(req, res, id) {
  try {
    const { name, ecomDetails, businessRules } = req.body;

    // Check if there's any data to update
    if (!name && !ecomDetails && !businessRules) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
        message: 'Provide at least one field to update: name, ecomDetails, or businessRules',
      });
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;

    // Validate ecomDetails if provided
    if (ecomDetails) {
      if (ecomDetails.platform || ecomDetails.accessKey) {
        // If updating ecomDetails, ensure both fields are present or fetch existing
        const existingMerchant = await Merchant.findById(id);
        if (!existingMerchant) {
          return res.status(404).json({
            success: false,
            error: 'Not found',
            message: `Merchant with ID ${id} not found`,
          });
        }

        // Merge with existing ecomDetails
        updateData.ecomDetails = {
          platform: ecomDetails.platform || existingMerchant.ecomDetails.platform,
          accessKey: ecomDetails.accessKey || existingMerchant.ecomDetails.accessKey,
        };

        // Validate platform
        const platformExists = await Merchant.validatePlatform(updateData.ecomDetails.platform);
        if (!platformExists) {
          return res.status(400).json({
            success: false,
            error: 'Invalid platform',
            message: `Platform "${updateData.ecomDetails.platform}" does not exist in ecommerce_details collection`,
          });
        }
      }
    }

    // Validate businessRules if provided
    if (businessRules) {
      // Validate rule keys
      const ruleValidation = await Merchant.validateBusinessRules(businessRules);
      if (!ruleValidation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid business rules',
          message: ruleValidation.message,
          invalidKeys: ruleValidation.invalidKeys,
        });
      }

      // Validate rule values
      const valueValidation = Merchant.validateBusinessRuleValues(businessRules);
      if (!valueValidation.valid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid business rule values',
          message: valueValidation.errors.join('; '),
        });
      }

      updateData.businessRules = businessRules;
    }

    // Update the document
    const updatedMerchant = await Merchant.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedMerchant) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Merchant with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Merchant updated successfully',
      data: updatedMerchant,
    });
  } catch (error) {
    console.error('Error updating merchant:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update merchant',
      message: error.message,
    });
  }
}

/**
 * Handle DELETE request - Delete merchant
 */
async function handleDelete(req, res, id) {
  try {
    // Delete the document
    const deletedMerchant = await Merchant.findByIdAndDelete(id);

    if (!deletedMerchant) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Merchant with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Merchant deleted successfully',
      data: deletedMerchant,
    });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete merchant',
      message: error.message,
    });
  }
}
