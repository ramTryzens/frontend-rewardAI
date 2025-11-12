import mongoose from 'mongoose';

/**
 * Merchant Schema
 * Stores merchant configurations that reference ecommerce platforms and business rules
 */
const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Merchant name is required'],
      trim: true,
    },
    ecomDetails: {
      platform: {
        type: String,
        required: [true, 'Ecommerce platform is required'],
        trim: true,
      },
      accessKey: {
        type: String,
        required: [true, 'Access key is required'],
        trim: true,
      },
    },
    businessRules: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Accepts boolean or number values
      default: {},
      required: [true, 'Business rules are required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'merchants', // Explicit collection name
  }
);

// Index for faster queries
merchantSchema.index({ name: 1 });
merchantSchema.index({ 'ecomDetails.platform': 1 });

/**
 * Validation method to check if platform exists in ecommerce_details
 * @param {String} platform - Platform name to validate
 * @returns {Promise<Boolean>}
 */
merchantSchema.statics.validatePlatform = async function (platform) {
  const EcommerceDetail = mongoose.model('EcommerceDetail');
  const existingPlatform = await EcommerceDetail.findOne({ name: platform });
  return !!existingPlatform;
};

/**
 * Validation method to check if all business rule keys exist in RuleEntriesTable
 * @param {Object} businessRules - Object with rule keys
 * @returns {Promise<Object>} { valid: boolean, invalidKeys: string[] }
 */
merchantSchema.statics.validateBusinessRules = async function (businessRules) {
  const RuleEntry = mongoose.model('RuleEntry');

  // Get all rule keys from the businessRules object
  const providedKeys = Object.keys(businessRules);

  if (providedKeys.length === 0) {
    return { valid: false, invalidKeys: [], message: 'At least one business rule is required' };
  }

  // Fetch all valid rule keys from RuleEntriesTable
  const validRules = await RuleEntry.find({}, { key: 1 });
  const validKeys = validRules.map((rule) => rule.key);

  // Check which provided keys are invalid
  const invalidKeys = providedKeys.filter((key) => !validKeys.includes(key));

  if (invalidKeys.length > 0) {
    return {
      valid: false,
      invalidKeys,
      message: `Invalid rule keys: ${invalidKeys.join(', ')}. Valid keys are: ${validKeys.join(', ')}`,
    };
  }

  return { valid: true, invalidKeys: [] };
};

/**
 * Validation method to validate business rule values
 * @param {Object} businessRules - Object with rule keys and values
 * @returns {Object} { valid: boolean, errors: string[] }
 */
merchantSchema.statics.validateBusinessRuleValues = function (businessRules) {
  const errors = [];

  for (const [key, value] of Object.entries(businessRules)) {
    // Check if value is boolean or number
    if (typeof value !== 'boolean' && typeof value !== 'number') {
      errors.push(`Rule "${key}" has invalid value type. Expected boolean or number, got ${typeof value}`);
    }

    // If it's a number, ensure it's not negative
    if (typeof value === 'number' && value < 0) {
      errors.push(`Rule "${key}" has negative value. Numbers must be >= 0`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Create and export the model
const Merchant = mongoose.model('Merchant', merchantSchema);

export default Merchant;
