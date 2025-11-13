import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isNotificationSent: {
      type: Boolean,
      default: false,
    },
    merchantDetails: {
      businessName: String,
      businessType: String,
      phoneNumber: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      ecommercePlatform: {
        platformId: mongoose.Schema.Types.ObjectId,
        platformName: String,
        credentials: mongoose.Schema.Types.Mixed, // Dynamic object to store platform-specific credentials
      },
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1, isApproved: 1 });
userSchema.index({ isAdmin: 1 });

const User = mongoose.model('User', userSchema);

export default User;
