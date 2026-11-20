import { Router } from 'express';
import {
  register,
  verifyEmailOtp,
  resendEmailOtp,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/verify-otp', authLimiter, verifyEmailOtp);
router.post('/resend-otp', authLimiter, resendEmailOtp);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

// Password recovery & Reset
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Public Auth Configuration (exposes Google Client ID & Email status safely at runtime)
router.get('/config', (req, res) => {
  const smtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim());
  res.status(200).json({
    success: true,
    googleClientId: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '',
    smtpConfigured,
    resendConfigured,
    emailConfigured: smtpConfigured || resendConfigured
  });
});

// Google OAuth
router.post('/google', authLimiter, googleAuth);

export default router;
