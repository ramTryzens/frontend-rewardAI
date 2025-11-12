/**
 * Vercel Serverless Function - Update or Delete Ecommerce Detail by ID
 * PATCH /api/ecommerce-details/:id
 * DELETE /api/ecommerce-details/:id
 */
import mongoose from 'mongoose';
import dbConnection from '../../config/database.js';
import EcommerceDetail from '../../models/EcommerceDetail.js';

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

  // Get ID from query params (Vercel dynamic route)
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
    console.error('Error in ecommerce-details handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
}

/**
 * Handle PATCH request - Update ecommerce detail
 */
async function handlePatch(req, res, id) {
  // Define allowed fields for update
  const allowedFields = ['name', 'api_version', 'api_urls', 'enabled'];
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

  // Validate api_urls structure if provided
  if (updateData.api_urls) {
    const apiUrls = updateData.api_urls;

    // Validate each endpoint in api_urls
    for (const [key, value] of Object.entries(apiUrls)) {
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

  // Update the document
  const updatedDetail = await EcommerceDetail.findByIdAndUpdate(
    id,
    { $set: updateData },
    {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    }
  );

  if (!updatedDetail) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: `Ecommerce detail with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Ecommerce detail updated successfully',
    data: updatedDetail,
  });
}

/**
 * Handle DELETE request - Delete ecommerce detail
 */
async function handleDelete(req, res, id) {
  // Delete the document
  const deletedDetail = await EcommerceDetail.findByIdAndDelete(id);

  if (!deletedDetail) {
    return res.status(404).json({
      success: false,
      error: 'Not found',
      message: `Ecommerce detail with ID ${id} not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Ecommerce detail deleted successfully',
    data: deletedDetail,
  });
}
