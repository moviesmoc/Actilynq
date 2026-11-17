import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { generateTokenAndSetCookie, clearAuthCookie } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema
} from '../validators/authValidator.js';
import { sendPasswordResetEmail } from '../services/emailService.js';

export async function register(req, res, next) {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    // Create Business first with 14-day free trial
    const trialExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const business = await Business.create({
      name: validatedData.businessName,
      businessType: 'travel_agency',
      currency: 'INR',
      isDemo: false,
      subscriptionPlan: 'trial',
      subscriptionExpiresAt: trialExpiry,
      maxUsers: 2
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Create User linked to Business
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      businessId: business._id,
      role: 'owner'
    });

    // Link owner to business
    business.ownerUserId = user._id;
    await business.save();

    // Generate JWT and set HttpOnly cookie
    const token = generateTokenAndSetCookie(res, user, business);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. 14-day free trial activated.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      business: {
        id: business._id,
        name: business.name,
        currency: business.currency,
        isDemo: business.isDemo,
        subscriptionPlan: business.subscriptionPlan,
        subscriptionExpiresAt: business.subscriptionExpiresAt,
        isTrialExpired: false,
        daysRemaining: 14
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.'
      });
    }

    const business = await Business.findById(user.businessId);
    if (!business) {
      return res.status(404).json({
        success: false,
        error: 'Associated business account not found.'
      });
    }

    const now = new Date();
    const expiresAt = business.subscriptionExpiresAt ? new Date(business.subscriptionExpiresAt) : null;
    const isTrialExpired = Boolean(expiresAt && now > expiresAt);
    const daysRemaining = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

    const token = generateTokenAndSetCookie(res, user, business);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      business: {
        id: business._id,
        name: business.name,
        currency: business.currency,
        isDemo: business.isDemo,
        subscriptionPlan: business.subscriptionPlan || 'trial',
        subscriptionExpiresAt: business.subscriptionExpiresAt || null,
        isTrialExpired,
        daysRemaining
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

export async function getMe(req, res) {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    },
    business: {
      id: req.user.businessId,
      name: req.user.businessName,
      currency: req.user.currency,
      isDemo: req.user.isDemo,
      subscriptionPlan: req.user.subscriptionPlan,
      subscriptionExpiresAt: req.user.subscriptionExpiresAt,
      isTrialExpired: req.user.isTrialExpired,
      daysRemaining: req.user.daysRemaining
    }
  });
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No registered account found with this email address.'
      });
    }

    // Generate secure 64-char crypto reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Valid 1 hour
    await user.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;

    // Dispatch automated password reset email via configured Gmail SMTP
    const mailResult = await sendPasswordResetEmail({
      toEmail: user.email,
      name: user.name,
      resetUrl
    });

    return res.status(200).json({
      success: true,
      message: mailResult.success
        ? `A password reset link has been dispatched to ${user.email}. Please check your inbox and click the link to reset your password.`
        : 'Unable to deliver password reset email. Please contact support.',
      emailSent: Boolean(mailResult.success)
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Password reset token is invalid or has expired. Please request a new link.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.'
    });
  } catch (error) {
    next(error);
  }
}

export async function googleAuth(req, res, next) {
  try {
    const validatedData = googleAuthSchema.parse(req.body);
    let { credential, email, name, googleId } = validatedData;

    // If client sent Google ID token credential from real Google popup, decode payload
    if (credential) {
      try {
        const payloadBase64 = credential.split('.')[1];
        const decoded = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
        if (decoded.email) {
          email = decoded.email;
          name = name || decoded.name;
          googleId = googleId || decoded.sub;
        }
      } catch (err) {
        console.warn('[Google Auth] Could not decode credential payload:', err.message);
      }
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Google authentication failed: Email address could not be verified.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, ...(googleId ? [{ googleId }] : [])]
    });
    let business;

    if (user) {
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        await user.save();
      }
      business = await Business.findById(user.businessId);
    } else {
      // New user via Google: create dedicated business with 14-day free trial
      const agencyName = name ? `${name.split(' ')[0]}'s Travel Agency` : 'Travel Agency';
      const trialExpiry = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

      business = await Business.create({
        name: agencyName,
        businessType: 'travel_agency',
        currency: 'INR',
        isDemo: false,
        subscriptionPlan: 'trial',
        subscriptionExpiresAt: trialExpiry,
        maxUsers: 2
      });

      const randomPassword = crypto.randomBytes(16).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        passwordHash,
        businessId: business._id,
        role: 'owner',
        googleId: googleId || `goog_${Date.now()}`
      });

      business.ownerUserId = user._id;
      await business.save();
    }

    const now = new Date();
    const expiresAt = business.subscriptionExpiresAt ? new Date(business.subscriptionExpiresAt) : null;
    const isTrialExpired = Boolean(expiresAt && now > expiresAt);
    const daysRemaining = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 0;

    const token = generateTokenAndSetCookie(res, user, business);

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      business: {
        id: business._id,
        name: business.name,
        currency: business.currency,
        isDemo: business.isDemo,
        subscriptionPlan: business.subscriptionPlan || 'trial',
        subscriptionExpiresAt: business.subscriptionExpiresAt || null,
        isTrialExpired,
        daysRemaining
      }
    });
  } catch (error) {
    next(error);
  }
}
