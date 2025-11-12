import express from 'express';
import RuleEntry from '../models/RuleEntry.js';

const router = express.Router();

/**
 * GET /api/rules
 * Retrieve all rule entries
 * Query params: ?enabled=true|false (optional filter)
 */
router.get('/', async (req, res) => {
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
});

/**
 * POST /api/rules
 * Create a new rule entry
 */
router.post('/', async (req, res) => {
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
});

/**
 * PATCH /api/rules/:id
 * Update a specific rule entry by its numeric id
 * Allows updating: key and enabled
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Parse numeric id
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID must be a numeric value',
      });
    }

    // Define allowed fields for update
    const allowedFields = ['key', 'enabled'];
    const updateData = {};

    // Extract only allowed fields from request body
    for (const field of allowedFields) {
      if (req.body.hasOwnProperty(field)) {
        updateData[field] = req.body[field];
      }
    }

    // Check if there's any valid data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
        message: `Allowed fields are: ${allowedFields.join(', ')}`,
      });
    }

    // Update the document by numeric id
    const updatedRule = await RuleEntry.findOneAndUpdate(
      { id: numericId },
      { $set: updateData },
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedRule) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Rule with id ${numericId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rule updated successfully',
      data: updatedRule,
    });
  } catch (error) {
    console.error('Error updating rule:', error);

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
      error: 'Failed to update rule',
      message: error.message,
    });
  }
});

/**
 * DELETE /api/rules/:id
 * Delete a specific rule entry by its numeric id
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Parse numeric id
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID must be a numeric value',
      });
    }

    // Delete the document by numeric id
    const deletedRule = await RuleEntry.findOneAndDelete({ id: numericId });

    if (!deletedRule) {
      return res.status(404).json({
        success: false,
        error: 'Not found',
        message: `Rule with id ${numericId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Rule deleted successfully',
      data: deletedRule,
    });
  } catch (error) {
    console.error('Error deleting rule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete rule',
      message: error.message,
    });
  }
});

export default router;
