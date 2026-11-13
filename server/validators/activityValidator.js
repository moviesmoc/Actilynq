import { z } from 'zod';
import { ACTIVITY_TYPES, CONTACT_OUTCOMES } from '../constants/workflow.js';

export const createActivitySchema = z.object({
  type: z.enum(Object.values(ACTIVITY_TYPES)),
  title: z.string().trim().min(2, 'Activity title must be at least 2 characters'),
  description: z.string().trim().optional().default(''),
  occurredAt: z.string().datetime().optional().nullable().or(z.date()),
  
  // Specific contact outcome (used by server to safely derive isCustomerContact)
  contactOutcome: z.enum([
    CONTACT_OUTCOMES.CONNECTED,
    CONTACT_OUTCOMES.SENT,
    CONTACT_OUTCOMES.COMPLETED,
    CONTACT_OUTCOMES.BUSY,
    CONTACT_OUTCOMES.NOT_REACHABLE,
    CONTACT_OUTCOMES.UNCONFIRMED
  ]).optional(),
  
  // Salesperson follow-up scheduling/clearing
  nextFollowUpAt: z.string().datetime().optional().nullable().or(z.literal('')).or(z.date()),
  clearFollowUp: z.boolean().optional(),
  
  metadata: z.record(z.any()).optional()
});
