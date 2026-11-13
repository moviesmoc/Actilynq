import bcrypt from 'bcryptjs';
import { Business } from '../models/Business.js';
import { User } from '../models/User.js';
import { Lead } from '../models/Lead.js';
import { LeadActivity } from '../models/LeadActivity.js';
import { ActionOverride } from '../models/ActionOverride.js';
import { getDemoLeadScenarios } from './demoData.js';
import { ACTIVITY_TYPES, STAGES, STAGE_LABELS } from '../constants/workflow.js';

/**
 * Idempotently seeds the demo business and travel scenarios if SEED_DEMO_DATA=true.
 */
export async function seedDemoDataIfRequested() {
  if (process.env.SEED_DEMO_DATA !== 'true') {
    return;
  }

  const demoEmail = (process.env.DEMO_EMAIL || 'demo@actilynq.com').toLowerCase().trim();
  const demoPassword = process.env.DEMO_PASSWORD || 'DemoPassword123!';

  try {
    let demoUser = await User.findOne({ email: demoEmail });
    let demoBusiness;

    if (!demoUser) {
      console.log(`[Demo Seed] Creating demo business & owner account (${demoEmail})...`);

      // 1. Create dedicated demo business
      demoBusiness = await Business.create({
        name: 'Wanderlust Journeys Travel Co. (Demo)',
        businessType: 'travel_agency',
        currency: 'INR',
        contactPhone: '+919820099887',
        isDemo: true // Crucial flag for safe demo resets
      });

      // 2. Hash demo password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(demoPassword, salt);

      // 3. Create demo user
      demoUser = await User.create({
        name: 'Priya Mehta (Sales Lead)',
        email: demoEmail,
        passwordHash,
        businessId: demoBusiness._id,
        role: 'owner'
      });

      demoBusiness.ownerUserId = demoUser._id;
      await demoBusiness.save();
    } else {
      demoBusiness = await Business.findById(demoUser.businessId);
      // Ensure isDemo flag is set on existing demo business
      if (demoBusiness && !demoBusiness.isDemo) {
        demoBusiness.isDemo = true;
        await demoBusiness.save();
      }
    }

    // Check if leads already seeded for this demo business
    const existingLeadsCount = await Lead.countDocuments({ businessId: demoBusiness._id });
    if (existingLeadsCount > 0) {
      console.log(`[Demo Seed] Demo data already exists (${existingLeadsCount} enquiries). Skipping duplicate seed.`);
      return;
    }

    console.log('[Demo Seed] Seeding 11 realistic travel scenarios with relative timestamps...');
    await populateDemoLeadsForBusiness(demoBusiness._id, demoUser._id);
    console.log('[Demo Seed] Completed successfully! Faculty demo environment is ready.');
  } catch (error) {
    console.error(`[Demo Seed Error]: ${error.message}`);
  }
}

/**
 * Populates leads and realistic activity timelines for a business
 */
export async function populateDemoLeadsForBusiness(businessId, userId) {
  const scenarios = getDemoLeadScenarios(new Date());

  for (const scenario of scenarios) {
    const lead = await Lead.create({
      ...scenario,
      businessId,
      createdBy: userId
    });

    // 1. Log initial creation note
    await LeadActivity.create({
      businessId,
      leadId: lead._id,
      userId,
      type: ACTIVITY_TYPES.NOTE,
      title: 'Enquiry Received',
      description: `Customer enquiry logged via ${scenario.leadSource}. Destination: ${scenario.destination || 'To be collected'}.`,
      isCustomerContact: false,
      occurredAt: scenario.lastActivityAt || new Date()
    });

    // 2. If stage is past Contacted, log initial outreach
    if (scenario.stage !== STAGES.NEW_ENQUIRY) {
      await LeadActivity.create({
        businessId,
        leadId: lead._id,
        userId,
        type: ACTIVITY_TYPES.CALL,
        title: 'Initial Contact Call',
        description: 'Spoke with customer regarding trip preferences, travel style, and approximate dates.',
        isCustomerContact: true,
        occurredAt: scenario.lastCustomerContactAt || scenario.lastActivityAt || new Date(),
        metadata: { contactOutcome: 'connected' }
      });
    }

    // 3. If quotation was sent, log quotation event
    if (scenario.quotationSentAt && scenario.quotationAmount) {
      await LeadActivity.create({
        businessId,
        leadId: lead._id,
        userId,
        type: ACTIVITY_TYPES.QUOTATION_SENT,
        title: `Quotation Sent (INR ${scenario.quotationAmount.toLocaleString()})`,
        description: `Custom package itinerary shared with customer for INR ${scenario.quotationAmount.toLocaleString()}.`,
        isCustomerContact: false,
        occurredAt: scenario.quotationSentAt,
        metadata: { quotationAmount: scenario.quotationAmount }
      });
    }
  }
}
