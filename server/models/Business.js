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
    }
  },
  {
    timestamps: true
  }
);

export const Business = mongoose.model('Business', businessSchema);
