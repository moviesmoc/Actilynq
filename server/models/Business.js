import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true
    },
    businessType: {
      type: String,
      enum: ['travel_agency'],
      default: 'travel_agency'
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true
    },
    isDemo: {
      type: Boolean,
      default: false,
      index: true
    },
    // Subscription & Trial Management
    subscriptionPlan: {
      type: String,
      enum: ['trial', 'starter', 'pro', 'enterprise'],
      default: 'trial'
    },
    subscriptionExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day free trial
      index: true
    },
    maxUsers: {
      type: Number,
      default: 2
    }
  },
  {
    timestamps: true
  }
);

export const Business = mongoose.model('Business', businessSchema);
