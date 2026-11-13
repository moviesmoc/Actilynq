import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateLead,
  evaluateAllLeads,
  RULE_IDS,
  buildWhatsAppDraft
} from '../services/nextActionEngine.js';
import { STAGES } from '../constants/workflow.js';

describe('Next-Action Engine — Deterministic Rule Evaluation', () => {
  const baseNow = new Date('2026-11-09T12:00:00Z');
  const dayMs = 24 * 60 * 60 * 1000;
  const hourMs = 60 * 60 * 1000;

  // --------------------------------------------------------------------------
  // Rule 1: OVERDUE_CALLBACK Tests
  // --------------------------------------------------------------------------
  describe('Rule 1: OVERDUE_CALLBACK', () => {
    it('should trigger when scheduled callback is in the past for an active lead', () => {
      const lead = {
        _id: 'lead-001',
        customerName: 'Aarav Patel',
        phone: '+919876543210',
        stage: STAGES.FOLLOW_UP,
        nextFollowUpAt: new Date(baseNow.getTime() - 3 * hourMs), // Due 3 hours ago
        lastActivityAt: new Date(baseNow.getTime() - 1 * dayMs)
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action, 'Expected recommendation to be generated');
      assert.equal(action.ruleId, RULE_IDS.OVERDUE_CALLBACK);
      assert.equal(action.priority, 'high');
      assert.match(action.explanation, /overdue by 3 hours/i);
    });

    it('should NOT trigger if the lead is in a terminal stage (Booking Confirmed or Lost)', () => {
      const wonLead = {
        _id: 'lead-002',
        customerName: 'Ravi Kumar',
        stage: STAGES.BOOKING_CONFIRMED,
        nextFollowUpAt: new Date(baseNow.getTime() - 5 * hourMs)
      };
      const lostLead = {
        _id: 'lead-003',
        customerName: 'Sunita Mehra',
        stage: STAGES.LOST,
        nextFollowUpAt: new Date(baseNow.getTime() - 5 * hourMs)
      };

      assert.equal(evaluateLead(wonLead, {}, baseNow), null);
      assert.equal(evaluateLead(lostLead, {}, baseNow), null);
    });

    it('should NOT trigger if callback is scheduled in the future', () => {
      const lead = {
        _id: 'lead-004',
        customerName: 'Karan Johar',
        stage: STAGES.FOLLOW_UP,
        nextFollowUpAt: new Date(baseNow.getTime() + 2 * hourMs)
      };
      const action = evaluateLead(lead, {}, baseNow);
      assert.notEqual(action?.ruleId, RULE_IDS.OVERDUE_CALLBACK);
    });
  });

  // --------------------------------------------------------------------------
  // Rule 2: QUOTATION_FOLLOW_UP Tests
  // --------------------------------------------------------------------------
  describe('Rule 2: QUOTATION_FOLLOW_UP', () => {
    it('should trigger when quotation was sent >= 2 days ago and no customer contact recorded', () => {
      const lead = {
        _id: 'lead-005',
        customerName: 'Pooja Bhatt',
        stage: STAGES.QUOTATION_SENT,
        quotationSentAt: new Date(baseNow.getTime() - 3 * dayMs), // 3 days ago
        lastCustomerContactAt: null,
        nextFollowUpAt: null
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action);
      assert.equal(action.ruleId, RULE_IDS.QUOTATION_FOLLOW_UP);
      assert.equal(action.priority, 'high');
      assert.match(action.explanation, /Quotation was sent 3 days ago/i);
    });

    it('should STILL TRIGGER when internal notes or stage updates occurred, because they are not customer contact', () => {
      const quoteTime = new Date(baseNow.getTime() - 3 * dayMs);
      const internalNoteTime = new Date(baseNow.getTime() - 1 * dayMs);

      const lead = {
        _id: 'lead-006',
        customerName: 'Rohit Roy',
        stage: STAGES.QUOTATION_SENT,
        quotationSentAt: quoteTime,
        lastActivityAt: internalNoteTime, // Internal note updated activity time
        lastCustomerContactAt: null, // But customer was NEVER contacted!
        nextFollowUpAt: null
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action, 'Should trigger because internal notes do not count as customer contact');
      assert.equal(action.ruleId, RULE_IDS.QUOTATION_FOLLOW_UP);
    });

    it('should NOT trigger if confirmed customer contact occurred after the quotation was sent', () => {
      const quoteTime = new Date(baseNow.getTime() - 3 * dayMs);
      const contactTime = new Date(baseNow.getTime() - 1 * dayMs); // Contacted 1 day ago

      const lead = {
        _id: 'lead-007',
        customerName: 'Deepak Chopra',
        stage: STAGES.QUOTATION_SENT,
        quotationSentAt: quoteTime,
        lastCustomerContactAt: contactTime, // Confirmed contact AFTER quote
        nextFollowUpAt: null
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.notEqual(action?.ruleId, RULE_IDS.QUOTATION_FOLLOW_UP);
    });

    it('should NOT trigger if salesperson scheduled a future follow-up date', () => {
      const quoteTime = new Date(baseNow.getTime() - 3 * dayMs);
      const futureFollowUp = new Date(baseNow.getTime() + 1 * dayMs); // Scheduled for tomorrow

      const lead = {
        _id: 'lead-008',
        customerName: 'Megha Reddy',
        stage: STAGES.QUOTATION_SENT,
        quotationSentAt: quoteTime,
        lastCustomerContactAt: null,
        nextFollowUpAt: futureFollowUp // Future date suppresses quotation follow-up
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.notEqual(action?.ruleId, RULE_IDS.QUOTATION_FOLLOW_UP);
    });
  });

  // --------------------------------------------------------------------------
  // Rule 3: MISSING_REQUIREMENTS Tests
  // --------------------------------------------------------------------------
  describe('Rule 3: MISSING_REQUIREMENTS', () => {
    it('should trigger when destination is missing on new_enquiry or contacted', () => {
      const lead = {
        _id: 'lead-009',
        customerName: 'Neha Sen',
        stage: STAGES.NEW_ENQUIRY,
        destination: null,
        travelStartDate: new Date(baseNow.getTime() + 30 * dayMs),
        travellerCount: 2
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action);
      assert.equal(action.ruleId, RULE_IDS.MISSING_REQUIREMENTS);
      assert.match(action.explanation, /destination/i);
    });

    it('should trigger when travellerCount is unknown (null) — never defaulting to 1', () => {
      const lead = {
        _id: 'lead-010',
        customerName: 'Gaurav Jain',
        stage: STAGES.CONTACTED,
        destination: 'Maldives',
        travelStartDate: new Date(baseNow.getTime() + 30 * dayMs),
        travellerCount: null // Unknown traveller count
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action);
      assert.equal(action.ruleId, RULE_IDS.MISSING_REQUIREMENTS);
      assert.match(action.explanation, /traveller count/i);
    });

    it('should NOT consider budget as a blocker for missing requirements', () => {
      const lead = {
        _id: 'lead-011',
        customerName: 'Kunal Kapoor',
        stage: STAGES.NEW_ENQUIRY,
        destination: 'Dubai',
        travelStartDate: new Date(baseNow.getTime() + 20 * dayMs),
        travellerCount: 2,
        budgetAmount: null // Optional budget omitted
      };

      const action = evaluateLead(lead, {}, baseNow);
      // Essential requirements (destination, dates, travellerCount) are present!
      assert.notEqual(action?.ruleId, RULE_IDS.MISSING_REQUIREMENTS);
    });
  });

  // --------------------------------------------------------------------------
  // Rule 4: QUOTATION_PREPARATION Tests
  // --------------------------------------------------------------------------
  describe('Rule 4: QUOTATION_PREPARATION', () => {
    it('should trigger only for eligible stages: requirements_collected and package_preparation', () => {
      const lead1 = {
        _id: 'lead-012',
        customerName: 'Tanya Mittal',
        stage: STAGES.REQUIREMENTS_COLLECTED,
        destination: 'Goa',
        travelStartDate: new Date(baseNow.getTime() + 15 * dayMs),
        travellerCount: 4,
        quotationSentAt: null
      };

      const action1 = evaluateLead(lead1, {}, baseNow);
      assert.ok(action1);
      assert.equal(action1.ruleId, RULE_IDS.QUOTATION_PREPARATION);
      assert.equal(action1.priority, 'medium');

      const lead2 = {
        ...lead1,
        _id: 'lead-013',
        stage: STAGES.PACKAGE_PREPARATION
      };
      const action2 = evaluateLead(lead2, {}, baseNow);
      assert.ok(action2);
      assert.equal(action2.ruleId, RULE_IDS.QUOTATION_PREPARATION);
    });

    it('should NOT trigger for new_enquiry or contacted stages', () => {
      const lead = {
        _id: 'lead-014',
        customerName: 'Varun Dhawan',
        stage: STAGES.NEW_ENQUIRY,
        destination: 'Goa',
        travelStartDate: new Date(baseNow.getTime() + 15 * dayMs),
        travellerCount: 4,
        quotationSentAt: null
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.notEqual(action?.ruleId, RULE_IDS.QUOTATION_PREPARATION);
    });
  });

  // --------------------------------------------------------------------------
  // Rule 5: INACTIVE_ENQUIRY Tests
  // --------------------------------------------------------------------------
  describe('Rule 5: INACTIVE_ENQUIRY', () => {
    it('should trigger when lead has had no activity for >= 7 days', () => {
      const lead = {
        _id: 'lead-015',
        customerName: 'Sanjay Dutt',
        stage: STAGES.CONTACTED,
        destination: 'Shimla',
        travelStartDate: new Date(baseNow.getTime() + 40 * dayMs),
        travellerCount: 2,
        lastActivityAt: new Date(baseNow.getTime() - 8 * dayMs) // 8 days inactive
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.ok(action);
      assert.equal(action.ruleId, RULE_IDS.INACTIVE_ENQUIRY);
      assert.equal(action.priority, 'low');
      assert.match(action.explanation, /for 8 days/i);
    });

    it('should NOT trigger if recent activity occurred within 7 days', () => {
      const lead = {
        _id: 'lead-016',
        customerName: 'Anil Kapoor',
        stage: STAGES.CONTACTED,
        destination: 'Shimla',
        travelStartDate: new Date(baseNow.getTime() + 40 * dayMs),
        travellerCount: 2,
        lastActivityAt: new Date(baseNow.getTime() - 5 * dayMs) // 5 days inactive
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.notEqual(action?.ruleId, RULE_IDS.INACTIVE_ENQUIRY);
    });
  });

  // --------------------------------------------------------------------------
  // Snoozing and Expiry Tests
  // --------------------------------------------------------------------------
  describe('Snoozing and Expiry Lifecycle', () => {
    it('should suppress a recommendation while snoozeUntil is in the future', () => {
      const lead = {
        _id: 'lead-017',
        customerName: 'Sara Ali Khan',
        stage: STAGES.FOLLOW_UP,
        nextFollowUpAt: new Date(baseNow.getTime() - 4 * hourMs)
      };

      const activeSnooze = {
        [RULE_IDS.OVERDUE_CALLBACK]: new Date(baseNow.getTime() + 12 * hourMs) // Snoozed for 12 more hours
      };

      const action = evaluateLead(lead, activeSnooze, baseNow);
      assert.equal(action, null, 'Active snooze must suppress recommendation');
    });

    it('should REAPPEAR once snoozeUntil expires', () => {
      const lead = {
        _id: 'lead-018',
        customerName: 'Sara Ali Khan',
        stage: STAGES.FOLLOW_UP,
        nextFollowUpAt: new Date(baseNow.getTime() - 4 * hourMs)
      };

      const expiredSnooze = {
        [RULE_IDS.OVERDUE_CALLBACK]: new Date(baseNow.getTime() - 1 * hourMs) // Expired 1 hour ago
      };

      const action = evaluateLead(lead, expiredSnooze, baseNow);
      assert.ok(action, 'Action should reappear after snooze expires');
      assert.equal(action.ruleId, RULE_IDS.OVERDUE_CALLBACK);
    });
  });

  // --------------------------------------------------------------------------
  // Precedence and Sorting Tests
  // --------------------------------------------------------------------------
  describe('Rule Precedence & Multi-lead Sorting', () => {
    it('Rule 1 should take precedence over Rule 2 when both conditions are met', () => {
      const lead = {
        _id: 'lead-019',
        customerName: 'Kiara Advani',
        stage: STAGES.QUOTATION_SENT,
        quotationSentAt: new Date(baseNow.getTime() - 3 * dayMs),
        nextFollowUpAt: new Date(baseNow.getTime() - 2 * hourMs), // Overdue callback
        lastCustomerContactAt: null
      };

      const action = evaluateLead(lead, {}, baseNow);
      assert.equal(action.ruleId, RULE_IDS.OVERDUE_CALLBACK, 'Overdue callback must take precedence over quotation follow-up');
    });

    it('evaluateAllLeads should sort by priority (high -> medium -> low) and due time', () => {
      const leads = [
        {
          _id: 'lead-low',
          customerName: 'Low Priority Lead',
          stage: STAGES.CONTACTED,
          destination: 'Manali',
          travelStartDate: new Date(baseNow.getTime() + 30 * dayMs),
          travellerCount: 2,
          lastActivityAt: new Date(baseNow.getTime() - 8 * dayMs) // Low
        },
        {
          _id: 'lead-high',
          customerName: 'High Priority Lead',
          stage: STAGES.FOLLOW_UP,
          nextFollowUpAt: new Date(baseNow.getTime() - 2 * hourMs) // High
        },
        {
          _id: 'lead-med',
          customerName: 'Med Priority Lead',
          stage: STAGES.REQUIREMENTS_COLLECTED,
          destination: 'Kerala',
          travelStartDate: new Date(baseNow.getTime() + 10 * dayMs),
          travellerCount: 2,
          quotationSentAt: null // Med
        }
      ];

      const queue = evaluateAllLeads(leads, [], baseNow);
      assert.equal(queue.length, 3);
      assert.equal(queue[0].priority, 'high');
      assert.equal(queue[1].priority, 'medium');
      assert.equal(queue[2].priority, 'low');
    });
  });

  // --------------------------------------------------------------------------
  // Draft generation tests
  // --------------------------------------------------------------------------
  describe('WhatsApp draft generator', () => {
    it('generates friendly draft with customer name and destination', () => {
      const draft = buildWhatsAppDraft({
        customerName: 'Nitin Patel',
        destination: 'Maldives'
      });
      assert.match(draft, /Hi Nitin Patel/);
      assert.match(draft, /trip to Maldives/);
    });
  });
});
