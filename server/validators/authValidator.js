import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'User name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  businessName: z.string().trim().min(2, 'Travel agency name must be at least 2 characters')
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateBusinessSchema = z.object({
  name: z.string().trim().min(2, 'Business name must be at least 2 characters').optional(),
  contactPhone: z.string().trim().optional(),
  currency: z.string().trim().min(2).max(5).optional()
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const googleAuthSchema = z.object({
  credential: z.string().optional(),
  email: z.string().trim().toLowerCase().email('Valid email is required').optional().or(z.literal('')),
  name: z.string().trim().optional(),
  googleId: z.string().optional()
}).refine((data) => Boolean(data.credential || (data.email && data.email.length > 0)), {
  message: 'Either Google credential token or email is required'
});

export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['agent', 'admin']).default('agent')
});
