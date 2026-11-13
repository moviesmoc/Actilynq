import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveIsCustomerContact,
  ACTIVITY_TYPES,
  CONTACT_OUTCOMES,
  STAGES,
  ALLOWED_STAGE_TRANSITIONS,
  TERMINAL_STAGES,
  ALLOWED_REOPEN_TARGET_STAGES
} from '../constants/workflow.js';
import {
  createLeadSchema,
  stageUpdateSchema,
  reopenLeadSchema
} from '../validators/leadValidator.js';

describe('Workflow, Stage Progression & Customer Contact Derivation', () => {
  describe('deriveIsCustomerContact (Server-Side derivation)', () => {
    it('returns true for confirmed call (outcome: connected)', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.CALL, CONTACT_OUTCOMES.CONNECTED), true);
    });

    it('returns false for unreached call (outcome: busy, not_reachable)', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.CALL, CONTACT_OUTCOMES.BUSY), false);
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.CALL, CONTACT_OUTCOMES.NOT_REACHABLE), false);
    });

    it('returns true for confirmed WhatsApp message (outcome: sent)', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.WHATSAPP, CONTACT_OUTCOMES.SENT), true);
    });

    it('returns false for unconfirmed WhatsApp draft click (outcome: unconfirmed)', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.WHATSAPP, CONTACT_OUTCOMES.UNCONFIRMED), false);
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.WHATSAPP, undefined), false);
    });

    it('returns true for sent email and completed meeting', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.EMAIL, CONTACT_OUTCOMES.SENT), true);
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.MEETING, CONTACT_OUTCOMES.COMPLETED), true);
    });

    it('returns false for internal notes, requirement edits, and stage updates', () => {
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.NOTE, 'connected'), false);
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.REQUIREMENT_UPDATE, 'sent'), false);
      assert.equal(deriveIsCustomerContact(ACTIVITY_TYPES.STAGE_CHANGE, 'sent'), false);
    });
  });

  describe('Lead Schema: Flexible & Incomplete Intake', () => {
    it('accepts raw incomplete leads with null trip parameters', () => {
      const rawLead = {
        customerName: 'Rohit Sharma',
        phone: '+919876543210',
        destination: null,
        travelStartDate: null,
        travelEndDate: null,
        travellerCount: null,
        budgetAmount: null
      };

      const parsed = createLeadSchema.parse(rawLead);
      assert.equal(parsed.customerName, 'Rohit Sharma');
      assert.equal(parsed.travellerCount, null, 'Must remain null, not defaulted to 1');
      assert.equal(parsed.destination, null);
    });

    it('rejects lead creation when customerName or phone is missing', () => {
      assert.throws(() => {
        createLeadSchema.parse({ phone: '+919876543210' });
      });
      assert.throws(() => {
        createLeadSchema.parse({ customerName: 'Ravi' });
      });
    });

    it('rejects travellerCount less than 1 when specified', () => {
      assert.throws(() => {
        createLeadSchema.parse({
          customerName: 'Ravi',
          phone: '+919876543210',
          travellerCount: 0
        });
      });
    });
  });

  describe('Stage Transition Graph & Terminal States', () => {
    it('prevents arbitrary jumping in ALLOWED_STAGE_TRANSITIONS', () => {
      const fromNew = ALLOWED_STAGE_TRANSITIONS[STAGES.NEW_ENQUIRY];
      assert.ok(fromNew.includes(STAGES.CONTACTED));
      assert.ok(fromNew.includes(STAGES.LOST));
      assert.equal(fromNew.includes(STAGES.QUOTATION_SENT), false, 'Cannot jump directly from New Enquiry to Quotation Sent');
    });

    it('terminal stages have empty forward transitions', () => {
      assert.deepEqual(ALLOWED_STAGE_TRANSITIONS[STAGES.BOOKING_CONFIRMED], []);
      assert.deepEqual(ALLOWED_STAGE_TRANSITIONS[STAGES.LOST], []);
    });

    it('reopen allows valid active targets', () => {
      assert.ok(ALLOWED_REOPEN_TARGET_STAGES.includes(STAGES.CONTACTED));
      assert.ok(ALLOWED_REOPEN_TARGET_STAGES.includes(STAGES.NEGOTIATION));
      assert.equal(ALLOWED_REOPEN_TARGET_STAGES.includes(STAGES.BOOKING_CONFIRMED), false);
    });

    it('stageUpdateSchema requires positive quotationAmount when moving to quotation_sent', () => {
      const valid = stageUpdateSchema.parse({
        toStage: STAGES.QUOTATION_SENT,
        quotationAmount: 250000
      });
      assert.equal(valid.quotationAmount, 250000);

      assert.throws(() => {
        stageUpdateSchema.parse({
          toStage: STAGES.QUOTATION_SENT,
          quotationAmount: -500
        });
      });
    });

    it('stageUpdateSchema requires lostReason when marking as lost', () => {
      const valid = stageUpdateSchema.parse({
        toStage: STAGES.LOST,
        lostReason: 'Budget mismatch'
      });
      assert.equal(valid.lostReason, 'Budget mismatch');
    });
  });
});
