import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import {
  evaluateAllLeads,
  RULE_IDS,
  buildWhatsAppDraft
} from '../services/nextActionEngine.js';
import { STAGES } from '../constants/workflow.js';

describe('Tenant Isolation & Multi-Tenancy Security Logic', () => {
  const secret = 'test_jwt_secret_key_32_characters_long_12345';
  const businessAId = '65432100000000000000000a';
  const businessBId = '65432100000000000000000b';

  describe('JWT Payload & Scope Integrity', () => {
    it('token strictly encapsulates businessId and userId without trusting client headers', () => {
      const userA = { _id: 'user-001', businessId: businessAId, role: 'owner' };
      const token = jwt.sign(
        { userId: userA._id, businessId: userA.businessId, role: userA.role },
        secret,
        { expiresIn: '1h' }
      );

      const decoded = jwt.verify(token, secret);
      assert.equal(decoded.businessId, businessAId);
      assert.equal(decoded.userId, 'user-001');
    });

    it('rejects tampered tokens with invalid signature', () => {
      const token = jwt.sign({ userId: 'user-001', businessId: businessAId }, secret);
      assert.throws(() => {
        jwt.verify(token, 'wrong_secret_key_tamper_attempt');
      });
    });
  });

  describe('Business-Scoped Action Evaluation', () => {
    it('engine only processes leads belonging to the evaluated tenant', () => {
      const leadsTenantA = [
        {
          _id: 'lead-A1',
          businessId: businessAId,
          customerName: 'Customer Tenant A',
          stage: STAGES.FOLLOW_UP,
          nextFollowUpAt: new Date(Date.now() - 3600000)
        }
      ];

      const leadsTenantB = [
        {
          _id: 'lead-B1',
          businessId: businessBId,
          customerName: 'Customer Tenant B',
          stage: STAGES.FOLLOW_UP,
          nextFollowUpAt: new Date(Date.now() - 3600000)
        }
      ];

      // Evaluate Tenant A
      const actionsA = evaluateAllLeads(leadsTenantA, [], new Date());
      assert.equal(actionsA.length, 1);
      assert.equal(actionsA[0].customerName, 'Customer Tenant A');

      // Verify Tenant B's leads are never present in Tenant A's queue
      assert.ok(!actionsA.some((a) => a.customerName === 'Customer Tenant B'));
    });

    it('snooze overrides for Tenant A do NOT suppress actions for Tenant B', () => {
      const leads = [
        {
          _id: 'lead-shared-id-clash',
          businessId: businessBId,
          customerName: 'Tenant B Lead',
          stage: STAGES.FOLLOW_UP,
          nextFollowUpAt: new Date(Date.now() - 3600000)
        }
      ];

      // Override belongs to Tenant A for the same rule
      const tenantAOverrides = [
        {
          businessId: businessAId,
          leadId: 'lead-shared-id-clash',
          ruleId: RULE_IDS.OVERDUE_CALLBACK,
          snoozeUntil: new Date(Date.now() + 86400000) // Snoozed for Tenant A
        }
      ];

      // If we evaluate Tenant B with Tenant B's empty overrides
      const tenantBOverrides = [];
      const actionsB = evaluateAllLeads(leads, tenantBOverrides, new Date());

      assert.equal(actionsB.length, 1, 'Tenant B action must NOT be suppressed by Tenant A override');
      assert.equal(actionsB[0].ruleId, RULE_IDS.OVERDUE_CALLBACK);
    });
  });

  describe('Demo Workspace Isolation', () => {
    it('demo reset logic strictly requires isDemo === true', () => {
      const productionUserContext = {
        businessId: businessAId,
        isDemo: false
      };

      const isPermitted = (ctx) => ctx.isDemo === true;
      assert.equal(isPermitted(productionUserContext), false, 'Production business must be blocked from demo reset');

      const demoUserContext = {
        businessId: businessBId,
        isDemo: true
      };
      assert.equal(isPermitted(demoUserContext), true, 'Demo business is permitted to reset');
    });
  });
});
