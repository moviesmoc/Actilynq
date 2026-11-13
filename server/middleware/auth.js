import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';

export const COOKIE_NAME = 'actilynq_token';

/**
 * Generate JWT and set secure HttpOnly cookie on response
 */
export function generateTokenAndSetCookie(res, user, business) {
  const secret = process.env.JWT_SECRET || 'actilynq_dev_jwt_secret_change_in_production_key_12345';
  const token = jwt.sign(
    {
      userId: user._id.toString(),
      businessId: user.businessId.toString(),
      role: user.role
    },
    secret,
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax'
  });
}

/**
 * Middleware: Verify JWT and attach tenant-isolated user context to req.user
 */
export async function requireAuth(req, res, next) {
  try {
    // Check HttpOnly cookie first, then fallback to Authorization header
    let token = req.cookies?.[COOKIE_NAME];
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
      });
    }

    const secret = process.env.JWT_SECRET || 'actilynq_dev_jwt_secret_change_in_production_key_12345';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid token. Please log in again.'
      });
    }

    const user = await User.findById(decoded.userId).select('-passwordHash').lean();
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        error: 'User account not found.'
      });
    }

    const business = await Business.findById(user.businessId).lean();
    if (!business) {
      clearAuthCookie(res);
      return res.status(401).json({
        success: false,
        error: 'Associated business account not found.'
      });
    }

    // Attach strictly validated tenant context to request
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      businessId: business._id, // Enforces tenant isolation
      businessName: business.name,
      currency: business.currency || 'INR',
      isDemo: Boolean(business.isDemo)
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failure.'
    });
  }
}
