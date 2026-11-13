import mongoose from 'mongoose';
import { ACTIVITY_TYPES } from '../constants/workflow.js';

const leadActivitySchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      required: true
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    occurredAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    // Derived strictly on backend from type & confirmed contactOutcome
    isCustomerContact: {
      type: Boolean,
      default: false,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

leadActivitySchema.index({ businessId: 1, leadId: 1, occurredAt: -1 });

export const LeadActivity = mongoose.model('LeadActivity', leadActivitySchema);
