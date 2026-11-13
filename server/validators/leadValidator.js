import { z } from 'zod';
import { STAGES } from '../constants/workflow.js';

export const createLeadSchema = z.object({
  customerName: z.string().trim().min(2, 'Customer name must be at least 2 characters'),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits'),
  email: z.string().trim().toLowerCase().email('Invalid email address').optional().nullable().or(z.literal('')),
  
  // Trip specifications — intentionally nullable/optional for raw incomplete leads
  destination: z.string().trim().optional().nullable().or(z.literal('')),
  departureCity: z.string().trim().optional().nullable().or(z.literal('')),
  travelStartDate: z.string().datetime().optional().nullable().or(z.literal('')).or(z.date()),
  travelEndDate: z.string().datetime().optional().nullable().or(z.literal('')).or(z.date()),
  travellerCount: z.number().int().min(1, 'Traveller count must be at least 1').optional().nullable(),
  budgetAmount: z.number().nonnegative().optional().nullable(),
  budgetCurrency: z.string().trim().default('INR'),
  
  travelType: z.enum(['leisure', 'honeymoon', 'family', 'adventure', 'business', 'group', 'other']).default('leisure'),
  accommodationPreference: z.enum(['budget', '3_star', '4_star', '5_star', 'resort', 'homestay', 'any']).default('any'),
  specialRequirements: z.string().trim().optional().nullable().or(z.literal('')),
  leadSource: z.enum(['manual', 'website', 'referral', 'social', 'phone', 'walk_in', 'other']).default('manual'),
  
  estimatedValue: z.number().nonnegative().optional().nullable(),
  nextFollowUpAt: z.string().datetime().optional().nullable().or(z.literal('')).or(z.date())
});

export const updateLeadSchema = createLeadSchema.partial();

export const stageUpdateSchema = z.object({
  toStage: z.enum(Object.values(STAGES)),
  note: z.string().trim().optional(),
  quotationAmount: z.number().positive('Quotation amount must be greater than 0').optional().nullable(),
  lostReason: z.string().trim().min(2, 'Reason is required when marking lead as lost').optional().nullable()
});

export const reopenLeadSchema = z.object({
  targetStage: z.enum([
    STAGES.CONTACTED,
    STAGES.REQUIREMENTS_COLLECTED,
    STAGES.PACKAGE_PREPARATION,
    STAGES.QUOTATION_SENT,
    STAGES.FOLLOW_UP,
    STAGES.NEGOTIATION
  ]),
  reason: z.string().trim().min(2, 'Reopen rationale is required')
});
