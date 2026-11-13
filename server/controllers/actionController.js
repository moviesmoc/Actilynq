import { Lead } from '../models/Lead.js';
import { ActionOverride } from '../models/ActionOverride.js';
import { TERMINAL_STAGES } from '../constants/workflow.js';
import { evaluateAllLeads, RULE_IDS } from '../services/nextActionEngine.js';
import { z } from 'zod';

const snoozeSchema = z.object({
  ruleId: z.enum(Object.values(RULE_IDS)),
  snoozeHours: z.number().positive().default(24),
  reason: z.string().trim().optional().default('')
});

export async function getActionQueue(req, res, next) {
  try {
    const businessId = req.user.businessId;
    const now = new Date();

    // 1. Fetch non-terminal, unarchived leads
    const leads = await Lead.find({
      businessId,
      isArchived: false,
      stage: { $nin: TERMINAL_STAGES }
    }).lean();

    // 2. Fetch active snooze overrides
    const overrides = await ActionOverride.find({
      businessId,
      snoozeUntil: { $gt: now }
    }).lean();

    // 3. Run deterministic Next-Action Engine
    const recommendations = evaluateAllLeads(leads, overrides, now);

    return res.status(200).json({
      success: true,
      recommendations,
      total: recommendations.length,
      evaluatedAt: now
    });
  } catch (error) {
    next(error);
  }
}

export async function snoozeAction(req, res, next) {
  try {
    const { leadId } = req.params;
    const validated = snoozeSchema.parse(req.body);
    const { ruleId, snoozeHours, reason } = validated;

    // Verify lead exists and belongs to current tenant
    const lead = await Lead.findOne({
      _id: leadId,
      businessId: req.user.businessId
    }).lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    const snoozeUntil = new Date(Date.now() + snoozeHours * 60 * 60 * 1000);

    // Idempotent upsert preventing duplicate rows
    const override = await ActionOverride.findOneAndUpdate(
      {
        businessId: req.user.businessId,
        leadId,
        ruleId
      },
      {
        $set: {
          snoozeUntil,
          reason
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: `Action snoozed until ${snoozeUntil.toLocaleString()}`,
      override
    });
  } catch (error) {
    next(error);
  }
}

export async function cancelSnooze(req, res, next) {
  try {
    const { leadId } = req.params;
    const { ruleId } = req.query;

    if (!ruleId) {
      return res.status(400).json({
        success: false,
        error: 'ruleId query parameter is required.'
      });
    }

    await ActionOverride.deleteOne({
      businessId: req.user.businessId,
      leadId,
      ruleId
    });

    return res.status(200).json({
      success: true,
      message: 'Snooze cancelled successfully.'
    });
  } catch (error) {
    next(error);
  }
}
