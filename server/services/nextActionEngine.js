import {
  STAGES,
  TERMINAL_STAGES,
  QUOTE_PREPARATION_STAGES
} from '../constants/workflow.js';

export const RULE_IDS = {
  OVERDUE_CALLBACK: 'OVERDUE_CALLBACK',
  QUOTATION_FOLLOW_UP: 'QUOTATION_FOLLOW_UP',
  MISSING_REQUIREMENTS: 'MISSING_REQUIREMENTS',
  QUOTATION_PREPARATION: 'QUOTATION_PREPARATION',
  INACTIVE_ENQUIRY: 'INACTIVE_ENQUIRY'
};

export const RULE_METADATA = {
  [RULE_IDS.OVERDUE_CALLBACK]: {
    id: RULE_IDS.OVERDUE_CALLBACK,
    name: 'Overdue Follow-up Callback',
    priority: 'high',
    defaultAction: 'call'
  },
  [RULE_IDS.QUOTATION_FOLLOW_UP]: {
    id: RULE_IDS.QUOTATION_FOLLOW_UP,
    name: 'Follow up on Sent Quotation',
    priority: 'high',
    defaultAction: 'whatsapp'
  },
  [RULE_IDS.MISSING_REQUIREMENTS]: {
    id: RULE_IDS.MISSING_REQUIREMENTS,
    name: 'Collect Missing Travel Requirements',
    priority: 'medium',
    defaultAction: 'update_requirements'
  },
  [RULE_IDS.QUOTATION_PREPARATION]: {
    id: RULE_IDS.QUOTATION_PREPARATION,
    name: 'Prepare Travel Quotation',
    priority: 'medium',
    defaultAction: 'prepare_quote'
  },
  [RULE_IDS.INACTIVE_ENQUIRY]: {
    id: RULE_IDS.INACTIVE_ENQUIRY,
    name: 'Re-engage Inactive Enquiry',
    priority: 'low',
    defaultAction: 'whatsapp'
  }
};

/**
 * Helper to compute human-friendly relative time difference
 */
function formatTimeDifference(ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'}`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'}`;
}

/**
 * Builds prefilled draft message for WhatsApp
 */
export function buildWhatsAppDraft(lead) {
  const customer = lead.customerName || 'there';
  const destination = lead.destination ? ` for your trip to ${lead.destination}` : '';
  return `Hi ${customer}, this is regarding your travel enquiry${destination}. Would you have a quick moment to connect regarding the updates?`;
}

/**
 * Evaluates a single lead against all 5 rules in strict priority order.
 * Returns at most ONE highest-priority recommendation or null.
 *
 * @param {Object} lead - Mongoose Lead document or plain JS object
 * @param {Map<string, Date>|Object} activeOverrides - Map of `ruleId` -> `snoozeUntil` Date
 * @param {Date} [now=new Date()] - Injectable timestamp for hermetic unit testing
 * @returns {Object|null} Recommendation object or null
 */
export function evaluateLead(lead, activeOverrides = {}, now = new Date()) {
  const currentTime = new Date(now).getTime();

  // 1. Terminal leads NEVER produce recommendations
  if (TERMINAL_STAGES.includes(lead.stage) || lead.isArchived) {
    return null;
  }

  const isRuleSnoozed = (ruleId) => {
    const snoozeUntil = activeOverrides instanceof Map
      ? activeOverrides.get(ruleId)
      : activeOverrides[ruleId];
    if (!snoozeUntil) return false;
    return new Date(snoozeUntil).getTime() > currentTime;
  };

  // -------------------------------------------------------------
  // RULE 1: OVERDUE_CALLBACK (Priority 1 - High)
  // -------------------------------------------------------------
  if (lead.nextFollowUpAt) {
    const followUpTime = new Date(lead.nextFollowUpAt).getTime();
    if (followUpTime < currentTime && !isRuleSnoozed(RULE_IDS.OVERDUE_CALLBACK)) {
      const overdueDiff = currentTime - followUpTime;
      const overdueText = formatTimeDifference(overdueDiff);

      return {
        leadId: lead._id,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination || 'Destination not specified',
        travellerCount: lead.travellerCount,
        travelStartDate: lead.travelStartDate,
        stage: lead.stage,
        ruleId: RULE_IDS.OVERDUE_CALLBACK,
        priority: 'high',
        actionTitle: 'Follow Up on Overdue Callback',
        explanation: `Scheduled follow-up callback was due on ${new Date(lead.nextFollowUpAt).toLocaleDateString()} and is overdue by ${overdueText}.`,
        dueText: `Overdue by ${overdueText}`,
        primaryAction: 'call',
        suggestedMessage: buildWhatsAppDraft(lead),
        dueAt: lead.nextFollowUpAt,
        isSnoozable: true
      };
    }
  }

  // -------------------------------------------------------------
  // RULE 2: QUOTATION_FOLLOW_UP (Priority 2 - High)
  // -------------------------------------------------------------
  if (lead.quotationSentAt) {
    const quoteSentTime = new Date(lead.quotationSentAt).getTime();
    const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
    const isPastTwoDays = currentTime - quoteSentTime >= twoDaysMs;

    // Respect salesperson-scheduled future follow-up dates
    const hasFutureFollowUp = lead.nextFollowUpAt && new Date(lead.nextFollowUpAt).getTime() > currentTime;

    // Qualifying contact check: Did confirmed customer contact occur AFTER quotationSentAt?
    const hasRecentCustomerContact = lead.lastCustomerContactAt &&
      new Date(lead.lastCustomerContactAt).getTime() > quoteSentTime;

    if (isPastTwoDays && !hasFutureFollowUp && !hasRecentCustomerContact && !isRuleSnoozed(RULE_IDS.QUOTATION_FOLLOW_UP)) {
      const daysSinceQuote = formatTimeDifference(currentTime - quoteSentTime);

      return {
        leadId: lead._id,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination || 'Destination not specified',
        travellerCount: lead.travellerCount,
        travelStartDate: lead.travelStartDate,
        quotationAmount: lead.quotationAmount,
        stage: lead.stage,
        ruleId: RULE_IDS.QUOTATION_FOLLOW_UP,
        priority: 'high',
        actionTitle: 'Follow Up on Sent Travel Quotation',
        explanation: `Quotation was sent ${daysSinceQuote} ago. No qualifying customer contact has been recorded since.`,
        dueText: `${daysSinceQuote} since quote`,
        primaryAction: 'whatsapp',
        suggestedMessage: buildWhatsAppDraft(lead),
        dueAt: new Date(quoteSentTime + twoDaysMs),
        isSnoozable: true
      };
    }
  }

  // -------------------------------------------------------------
  // RULE 3: MISSING_REQUIREMENTS (Priority 3 - Medium)
  // -------------------------------------------------------------
  if ([STAGES.NEW_ENQUIRY, STAGES.CONTACTED].includes(lead.stage)) {
    const missing = [];
    if (!lead.destination || lead.destination.trim() === '') missing.push('destination');
    if (!lead.travelStartDate) missing.push('travel start date');
    if (lead.travellerCount === null || lead.travellerCount === undefined) missing.push('traveller count');

    if (missing.length > 0 && !isRuleSnoozed(RULE_IDS.MISSING_REQUIREMENTS)) {
      const missingList = missing.join(', ');
      return {
        leadId: lead._id,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination || 'Incomplete',
        travellerCount: lead.travellerCount,
        travelStartDate: lead.travelStartDate,
        stage: lead.stage,
        ruleId: RULE_IDS.MISSING_REQUIREMENTS,
        priority: 'medium',
        actionTitle: 'Collect Missing Travel Requirements',
        explanation: `Essential details missing: ${missingList}. Collect these trip parameters before preparing the package.`,
        dueText: 'Requirements Incomplete',
        primaryAction: 'update_requirements',
        suggestedMessage: buildWhatsAppDraft(lead),
        dueAt: lead.createdAt || now,
        isSnoozable: true
      };
    }
  }

  // -------------------------------------------------------------
  // RULE 4: QUOTATION_PREPARATION (Priority 4 - Medium)
  // -------------------------------------------------------------
  if (QUOTE_PREPARATION_STAGES.includes(lead.stage) && !lead.quotationSentAt) {
    // Stage eligibility confirmed via explicit allowlist
    if (!isRuleSnoozed(RULE_IDS.QUOTATION_PREPARATION)) {
      return {
        leadId: lead._id,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination || 'Custom Package',
        travellerCount: lead.travellerCount,
        travelStartDate: lead.travelStartDate,
        budgetAmount: lead.budgetAmount,
        budgetCurrency: lead.budgetCurrency,
        stage: lead.stage,
        ruleId: RULE_IDS.QUOTATION_PREPARATION,
        priority: 'medium',
        actionTitle: 'Prepare & Send Travel Quotation',
        explanation: 'Travel requirements have been gathered. Prepare custom itinerary package and share quotation.',
        dueText: 'Quotation Ready to Prepare',
        primaryAction: 'prepare_quote',
        suggestedMessage: buildWhatsAppDraft(lead),
        dueAt: lead.lastActivityAt || now,
        isSnoozable: true
      };
    }
  }

  // -------------------------------------------------------------
  // RULE 5: INACTIVE_ENQUIRY (Priority 5 - Low)
  // -------------------------------------------------------------
  if (lead.lastActivityAt) {
    const lastActivityTime = new Date(lead.lastActivityAt).getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const isPastSevenDays = currentTime - lastActivityTime >= sevenDaysMs;

    if (isPastSevenDays && !isRuleSnoozed(RULE_IDS.INACTIVE_ENQUIRY)) {
      const inactiveDuration = formatTimeDifference(currentTime - lastActivityTime);

      return {
        leadId: lead._id,
        customerName: lead.customerName,
        phone: lead.phone,
        email: lead.email,
        destination: lead.destination || 'Enquiry',
        travellerCount: lead.travellerCount,
        travelStartDate: lead.travelStartDate,
        stage: lead.stage,
        ruleId: RULE_IDS.INACTIVE_ENQUIRY,
        priority: 'low',
        actionTitle: 'Re-engage Inactive Enquiry',
        explanation: `No activity or updates have been recorded on this enquiry for ${inactiveDuration}. Review or check in with customer.`,
        dueText: `Inactive for ${inactiveDuration}`,
        primaryAction: 'whatsapp',
        suggestedMessage: buildWhatsAppDraft(lead),
        dueAt: new Date(lastActivityTime + sevenDaysMs),
        isSnoozable: true
      };
    }
  }

  return null;
}

/**
 * Evaluates multiple leads for a business, applies snooze overrides,
 * and sorts recommendations by priority (high -> medium -> low) and due date.
 *
 * @param {Array<Object>} leads - Array of Lead documents
 * @param {Array<Object>} overrides - Array of ActionOverride documents for the business
 * @param {Date} [now=new Date()] - Injectable timestamp
 * @returns {Array<Object>} Sorted list of recommendations
 */
export function evaluateAllLeads(leads = [], overrides = [], now = new Date()) {
  const currentTime = new Date(now).getTime();

  // Build active overrides lookup: key = `${leadId}_${ruleId}` -> snoozeUntil Date
  const overrideMap = new Map();
  for (const ov of overrides) {
    if (ov.snoozeUntil && new Date(ov.snoozeUntil).getTime() > currentTime) {
      const key = `${ov.leadId.toString()}_${ov.ruleId}`;
      overrideMap.set(key, ov.snoozeUntil);
    }
  }

  const recommendations = [];

  for (const lead of leads) {
    const leadIdStr = lead._id.toString();
    // Build lead-specific active overrides
    const leadOverrides = {};
    for (const ruleId of Object.values(RULE_IDS)) {
      const key = `${leadIdStr}_${ruleId}`;
      if (overrideMap.has(key)) {
        leadOverrides[ruleId] = overrideMap.get(key);
      }
    }

    const rec = evaluateLead(lead, leadOverrides, now);
    if (rec) {
      recommendations.push(rec);
    }
  }

  // Priority ranking for sorting: high (1) > medium (2) > low (3)
  const priorityRank = { high: 1, medium: 2, low: 3 };

  return recommendations.sort((a, b) => {
    const pDiff = (priorityRank[a.priority] || 99) - (priorityRank[b.priority] || 99);
    if (pDiff !== 0) return pDiff;
    const timeA = a.dueAt ? new Date(a.dueAt).getTime() : 0;
    const timeB = b.dueAt ? new Date(b.dueAt).getTime() : 0;
    return timeA - timeB;
  });
}
