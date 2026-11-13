import mongoose from 'mongoose';

const actionOverrideSchema = new mongoose.Schema(
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
    ruleId: {
      type: String,
      required: true,
      trim: true
    },
    snoozeUntil: {
      type: Date,
      required: true,
      index: true
    },
    reason: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index ensuring idempotency — no duplicate active snoozes
actionOverrideSchema.index({ businessId: 1, leadId: 1, ruleId: 1 }, { unique: true });

export const ActionOverride = mongoose.model('ActionOverride', actionOverrideSchema);
