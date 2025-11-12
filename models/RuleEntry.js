import mongoose from 'mongoose';

/**
 * Rule Entry Schema
 * Stores business rules with numeric IDs for logic and enabled/disabled state
 */
const ruleEntrySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: [true, 'Numeric ID is required'],
      unique: true,
      index: true,
    },
    key: {
      type: String,
      required: [true, 'Rule key is required'],
      trim: true,
      uppercase: true,
    },
    enabled: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'RuleEntriesTable', // Explicit collection name
  }
);

// Index for faster queries
ruleEntrySchema.index({ id: 1 });
ruleEntrySchema.index({ key: 1 });
ruleEntrySchema.index({ enabled: 1 });

// Create and export the model
const RuleEntry = mongoose.model('RuleEntry', ruleEntrySchema);

export default RuleEntry;
