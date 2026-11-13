import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { generateTokenAndSetCookie, clearAuthCookie } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

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

    // Create Business first
    const business = await Business.create({
      name: validatedData.businessName,
      businessType: 'travel_agency',
      currency: 'INR',
      isDemo: false
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
      message: 'Registration successful',
      token, // Also return token for environments where cookie is not supported
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
        isDemo: business.isDemo
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
        isDemo: business.isDemo
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
      isDemo: req.user.isDemo
    }
  });
}
