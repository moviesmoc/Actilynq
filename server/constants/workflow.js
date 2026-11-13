/**
 * ActiLynq Workflow Constants & Stage Transition Rules
 */

export const STAGES = {
  NEW_ENQUIRY: 'new_enquiry',
  CONTACTED: 'contacted',
  REQUIREMENTS_COLLECTED: 'requirements_collected',
  PACKAGE_PREPARATION: 'package_preparation',
  QUOTATION_SENT: 'quotation_sent',
  FOLLOW_UP: 'follow_up',
  NEGOTIATION: 'negotiation',
  BOOKING_CONFIRMED: 'booking_confirmed',
  LOST: 'lost'
};

export const STAGE_LABELS = {
  [STAGES.NEW_ENQUIRY]: 'New Enquiry',
  [STAGES.CONTACTED]: 'Contacted',
  [STAGES.REQUIREMENTS_COLLECTED]: 'Requirements Collected',
  [STAGES.PACKAGE_PREPARATION]: 'Package Preparation',
  [STAGES.QUOTATION_SENT]: 'Quotation Sent',
  [STAGES.FOLLOW_UP]: 'Follow-up',
  [STAGES.NEGOTIATION]: 'Negotiation',
  [STAGES.BOOKING_CONFIRMED]: 'Booking Confirmed',
  [STAGES.LOST]: 'Lost'
};

export const STAGE_RANK = {
  [STAGES.NEW_ENQUIRY]: 1,
  [STAGES.CONTACTED]: 2,
  [STAGES.REQUIREMENTS_COLLECTED]: 3,
  [STAGES.PACKAGE_PREPARATION]: 4,
  [STAGES.QUOTATION_SENT]: 5,
  [STAGES.FOLLOW_UP]: 6,
  [STAGES.NEGOTIATION]: 7,
  [STAGES.BOOKING_CONFIRMED]: 8,
  [STAGES.LOST]: 9
};

export const TERMINAL_STAGES = [STAGES.BOOKING_CONFIRMED, STAGES.LOST];

export const QUOTE_PREPARATION_STAGES = [
  STAGES.REQUIREMENTS_COLLECTED,
  STAGES.PACKAGE_PREPARATION
];

/**
 * Valid stage transition map.
 * Ordinary stage updates cannot jump arbitrarily.
 * Terminal stages (booking_confirmed, lost) cannot transition via normal stage updates.
 */
export const ALLOWED_STAGE_TRANSITIONS = {
  [STAGES.NEW_ENQUIRY]: [STAGES.CONTACTED, STAGES.LOST],
  [STAGES.CONTACTED]: [STAGES.REQUIREMENTS_COLLECTED, STAGES.LOST],
  [STAGES.REQUIREMENTS_COLLECTED]: [STAGES.PACKAGE_PREPARATION, STAGES.LOST],
  [STAGES.PACKAGE_PREPARATION]: [STAGES.QUOTATION_SENT, STAGES.LOST],
  [STAGES.QUOTATION_SENT]: [STAGES.FOLLOW_UP, STAGES.NEGOTIATION, STAGES.BOOKING_CONFIRMED, STAGES.LOST],
  [STAGES.FOLLOW_UP]: [STAGES.NEGOTIATION, STAGES.BOOKING_CONFIRMED, STAGES.LOST],
  [STAGES.NEGOTIATION]: [STAGES.FOLLOW_UP, STAGES.BOOKING_CONFIRMED, STAGES.LOST],
  // Terminal stages have NO valid ordinary forward transitions
  [STAGES.BOOKING_CONFIRMED]: [],
  [STAGES.LOST]: []
};

/**
 * Valid stages allowed when a terminal lead is reopened explicitly.
 */
export const ALLOWED_REOPEN_TARGET_STAGES = [
  STAGES.CONTACTED,
  STAGES.REQUIREMENTS_COLLECTED,
  STAGES.PACKAGE_PREPARATION,
  STAGES.QUOTATION_SENT,
  STAGES.FOLLOW_UP,
  STAGES.NEGOTIATION
];

export const ACTIVITY_TYPES = {
  CALL: 'call',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  MEETING: 'meeting',
  NOTE: 'note',
  REQUIREMENT_UPDATE: 'requirement_update',
  QUOTATION_SENT: 'quotation_sent',
  FOLLOW_UP: 'follow_up',
  STAGE_CHANGE: 'stage_change',
  OTHER: 'other'
};

export const CONTACT_OUTCOMES = {
  CONNECTED: 'connected',
  SENT: 'sent',
  COMPLETED: 'completed',
  BUSY: 'busy',
  NOT_REACHABLE: 'not_reachable',
  UNCONFIRMED: 'unconfirmed'
};

/**
 * Server-side derivation of whether an activity constitutes confirmed customer contact.
 * NEVER trust a boolean from frontend input!
 *
 * @param {string} type - Activity type
 * @param {string|undefined} outcome - Specific outcome/status
 * @returns {boolean} true if confirmed customer contact, false otherwise
 */
export function deriveIsCustomerContact(type, outcome) {
  if (!type) return false;
  const normalizedType = type.toLowerCase();
  const normalizedOutcome = outcome ? outcome.toLowerCase() : '';

  switch (normalizedType) {
    case ACTIVITY_TYPES.CALL:
      return normalizedOutcome === CONTACT_OUTCOMES.CONNECTED;
    case ACTIVITY_TYPES.WHATSAPP:
      return normalizedOutcome === CONTACT_OUTCOMES.SENT;
    case ACTIVITY_TYPES.EMAIL:
      return normalizedOutcome === CONTACT_OUTCOMES.SENT;
    case ACTIVITY_TYPES.MEETING:
      return normalizedOutcome === CONTACT_OUTCOMES.COMPLETED;
    default:
      // Notes, requirement updates, stage changes, quotes, etc. are NOT customer contact
      return false;
  }
}
