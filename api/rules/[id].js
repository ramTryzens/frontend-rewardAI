/**
 * Vercel Serverless Function - Update or Delete Rule by Numeric ID
 * PATCH /api/rules/:id
 * DELETE /api/rules/:id
 */
import dbConnection from '../../config/database.js';
import RuleEntry from '../../models/RuleEntry.js';

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

  // Get numeric ID from query params (Vercel dynamic route)
  const { id } = req.query;

  // Parse numeric id
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: 'The provided ID must be a numeric value',
    });
  }

  try {
    // Ensure database connection
    if (!dbConnection.getConnectionStatus()) {
      await dbConnection.connect();
    }

    // Handle PATCH request (Update)
    if (req.method === 'PATCH') {
      return await handlePatch(req, res, numericId);
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
      return await handleDelete(req, res, numericId);
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
 * Handle PATCH request - Update rule
 */
async function handlePatch(req, res, numericId) {
  try {
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
}

/**
 * Handle DELETE request - Delete rule
 */
async function handleDelete(req, res, numericId) {
  try {
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
}
