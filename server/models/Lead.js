import mongoose from 'mongoose';
import { STAGES } from '../constants/workflow.js';

const leadSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },

    // Travel Requirements (Nullable for incomplete raw lead capture)
    destination: {
      type: String,
      trim: true,
      default: null
    },
    departureCity: {
      type: String,
      trim: true,
      default: null
    },
    travelStartDate: {
      type: Date,
      default: null
    },
    travelEndDate: {
      type: Date,
      default: null
    },
    travellerCount: {
      type: Number,
      default: null,
      min: [1, 'Traveller count must be at least 1 when specified']
    },
    budgetAmount: {
      type: Number,
      default: null
    },
    budgetCurrency: {
      type: String,
      default: 'INR',
      trim: true
    },
    travelType: {
      type: String,
      enum: ['leisure', 'honeymoon', 'family', 'adventure', 'business', 'group', 'other'],
      default: 'leisure'
    },
    accommodationPreference: {
      type: String,
      enum: ['budget', '3_star', '4_star', '5_star', 'resort', 'homestay', 'any'],
      default: 'any'
    },
    specialRequirements: {
      type: String,
      default: null,
      trim: true
    },
    leadSource: {
      type: String,
      enum: ['manual', 'website', 'referral', 'social', 'phone', 'walk_in', 'other'],
      default: 'manual'
    },

    // Travel Sales Workflow Stage
    stage: {
      type: String,
      enum: Object.values(STAGES),
      default: STAGES.NEW_ENQUIRY,
      index: true
    },
    estimatedValue: {
      type: Number,
      default: null
    },
    quotationAmount: {
      type: Number,
      default: null
    },
    quotationSentAt: {
      type: Date,
      default: null,
      index: true
    },
    nextFollowUpAt: {
      type: Date,
      default: null,
      index: true
    },

    // Dual activity tracking timestamps
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastCustomerContactAt: {
      type: Date,
      default: null,
      index: true
    },

    lostReason: {
      type: String,
      default: null,
      trim: true
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for business-scoped queries
leadSchema.index({ businessId: 1, isArchived: 1, stage: 1 });
leadSchema.index({ businessId: 1, nextFollowUpAt: 1 });
leadSchema.index({ businessId: 1, quotationSentAt: 1 });
leadSchema.index({ businessId: 1, lastActivityAt: -1 });
leadSchema.index({ businessId: 1, lastCustomerContactAt: -1 });

export const Lead = mongoose.model('Lead', leadSchema);
