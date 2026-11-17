import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { forgotPasswordSchema, resetPasswordSchema, googleAuthSchema } from '../validators/authValidator.js';
import { requireActiveSubscription } from '../middleware/auth.js';

describe('Trial & Plan Expiry & Auth Recovery Logic', () => {
  describe('requireActiveSubscription Middleware Enforcement', () => {
    it('allows access when trial is active', () => {
      let nextCalled = false;
      const req = { user: { isTrialExpired: false, isDemo: false } };
      const res = {};
      requireActiveSubscription(req, res, () => { nextCalled = true; });
      assert.equal(nextCalled, true);
    });

    it('blocks access with 403 when real user trial is expired', () => {
      let statusSent = null;
      let jsonSent = null;
      let nextCalled = false;

      const req = { user: { isTrialExpired: true, isDemo: false } };
      const res = {
        status(s) { statusSent = s; return this; },
        json(j) { jsonSent = j; return this; }
      };

      requireActiveSubscription(req, res, () => { nextCalled = true; });

      assert.equal(nextCalled, false);
      assert.equal(statusSent, 403);
      assert.equal(jsonSent.trialExpired, true);
      assert.ok(jsonSent.error.includes('7359510771'));
    });

    it('allows demo account access even when expired for academic evaluation', () => {
      let nextCalled = false;
      const req = { user: { isTrialExpired: true, isDemo: true } };
      const res = {};
      requireActiveSubscription(req, res, () => { nextCalled = true; });
      assert.equal(nextCalled, true);
    });
  });
  describe('Trial Calculation Logic', () => {
    it('calculates active trial with days remaining', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const isTrialExpired = Boolean(now > expiresAt);
      const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      assert.equal(isTrialExpired, false);
      assert.equal(daysRemaining, 14);
    });

    it('detects expired trial when expiresAt is in the past', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const isTrialExpired = Boolean(now > expiresAt);
      const daysRemaining = Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

      assert.equal(isTrialExpired, true);
      assert.equal(daysRemaining, 0);
    });
  });

  describe('Password Recovery Validation', () => {
    it('validates email for forgot password request', () => {
      const valid = forgotPasswordSchema.parse({ email: 'AGENT@TravelAgency.com' });
      assert.equal(valid.email, 'agent@travelagency.com');

      assert.throws(() => {
        forgotPasswordSchema.parse({ email: 'not-an-email' });
      });
    });

    it('validates token and minimum 8 char password for reset password', () => {
      const valid = resetPasswordSchema.parse({
        token: 'abcdef1234567890abcdef1234567890',
        password: 'NewStrongPassword123!'
      });
      assert.equal(valid.token, 'abcdef1234567890abcdef1234567890');

      assert.throws(() => {
        resetPasswordSchema.parse({
          token: '',
          password: 'short'
        });
      });
    });
  });

  describe('Google OAuth Schema Validation', () => {
    it('accepts valid Google profile parameters', () => {
      const valid = googleAuthSchema.parse({
        email: 'Nilesh.Travels@Gmail.com',
        name: 'Nilesh Travels',
        googleId: 'goog_123456789'
      });
      assert.equal(valid.email, 'nilesh.travels@gmail.com');
      assert.equal(valid.name, 'Nilesh Travels');
    });

    it('rejects invalid Google login without email', () => {
      assert.throws(() => {
        googleAuthSchema.parse({
          name: 'Nilesh'
        });
      });
    });
  });
});
