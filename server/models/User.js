import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: null
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['owner', 'agent', 'admin'],
      default: 'owner'
    },
    // Email Verification via 6-digit OTP
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    emailVerificationOtp: {
      type: String,
      default: null,
      index: true
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    },
    emailVerificationAttempts: {
      type: Number,
      default: 0
    },
    // Password Reset tokens
    resetPasswordToken: {
      type: String,
      default: null,
      index: true
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    // Google OAuth Linkage
    googleId: {
      type: String,
      default: null,
      sparse: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);
