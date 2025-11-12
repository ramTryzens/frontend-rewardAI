import express from 'express';
import mongoose from 'mongoose';
import Merchant from '../models/Merchant.js';

const router = express.Router();

/**
 * GET /api/merchants
 * Retrieve all merchants
 */
router.get('/', async (req, res) => {
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
});

/**
 * POST /api/merchants
 * Create a new merchant with validation
 */
router.post('/', async (req, res) => {
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
});

/**
 * PATCH /api/merchants/:id
 * Update a specific merchant by MongoDB _id
 * Allows updating: name, ecomDetails, and businessRules
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID is not a valid MongoDB ObjectId',
      });
    }

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
});

/**
 * DELETE /api/merchants/:id
 * Delete a specific merchant by MongoDB _id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID is not a valid MongoDB ObjectId',
      });
    }

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
});

export default router;
