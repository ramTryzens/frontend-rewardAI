import mongoose from 'mongoose';

/**
 * Ecommerce Detail Schema
 * Stores e-commerce platform configurations including API endpoints
 */
const ecommerceDetailSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
    },
    api_version: {
      type: String,
      required: [true, 'API version is required'],
      trim: true,
    },
    api_urls: {
      type: Map,
      of: {
        endpoint: {
          type: String,
          required: true,
        },
        method: {
          type: String,
          required: true,
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          uppercase: true,
        },
      },
      default: {},
    },
    enabled: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'ecommerce_details', // Explicit collection name
  }
);

// Index for faster queries
ecommerceDetailSchema.index({ name: 1 });

// Create and export the model
const EcommerceDetail = mongoose.model('EcommerceDetail', ecommerceDetailSchema);

export default EcommerceDetail;
