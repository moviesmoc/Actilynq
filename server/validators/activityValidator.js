import { z } from 'zod';
import { ACTIVITY_TYPES, CONTACT_OUTCOMES } from '../constants/workflow.js';

// Preprocess and validate flexible date/datetime input (accepts ISO strings, HTML5 datetime-local, date-only, Date objects, or null/empty)
const flexibleDateSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return null;
  return val;
}, z.union([
  z.date(),
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date or datetime format'
  })
]).optional().nullable());

export const createActivitySchema = z.object({
  type: z.enum(Object.values(ACTIVITY_TYPES)),
  title: z.string().trim().min(2, 'Activity title must be at least 2 characters'),
  description: z.string().trim().optional().default(''),
  occurredAt: flexibleDateSchema,
  
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
  nextFollowUpAt: flexibleDateSchema,
  clearFollowUp: z.boolean().optional(),
  
  metadata: z.record(z.any()).optional()
});
