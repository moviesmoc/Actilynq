import { Lead } from '../models/Lead.js';
import { LeadActivity } from '../models/LeadActivity.js';
import {
  STAGES,
  STAGE_LABELS,
  TERMINAL_STAGES,
  ALLOWED_STAGE_TRANSITIONS,
  ALLOWED_REOPEN_TARGET_STAGES,
  ACTIVITY_TYPES
} from '../constants/workflow.js';
import {
  createLeadSchema,
  updateLeadSchema,
  stageUpdateSchema,
  reopenLeadSchema
} from '../validators/leadValidator.js';

export async function listLeads(req, res, next) {
  try {
    const {
      page = 1,
      limit = 25,
      stage,
      travelType,
      search,
      includeArchived = 'false'
    } = req.query;

    const query = {
      businessId: req.user.businessId
    };

    if (includeArchived !== 'true') {
      query.isArchived = false;
    }

    if (stage && Object.values(STAGES).includes(stage)) {
      query.stage = stage;
    }

    if (travelType) {
      query.travelType = travelType;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { customerName: regex },
        { phone: regex },
        { email: regex },
        { destination: regex },
        { departureCity: regex }
      ];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const take = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .sort({ lastActivityAt: -1 })
        .skip(skip)
        .limit(take)
        .lean(),
      Lead.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      leads,
      pagination: {
        page: parseInt(page, 10),
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function createLead(req, res, next) {
  try {
    const validatedData = createLeadSchema.parse(req.body);

    const lead = await Lead.create({
      ...validatedData,
      businessId: req.user.businessId, // Derive strictly from auth session
      createdBy: req.user._id,
      stage: STAGES.NEW_ENQUIRY,
      lastActivityAt: new Date()
    });

    // Create initial activity record
    await LeadActivity.create({
      businessId: req.user.businessId,
      leadId: lead._id,
      userId: req.user._id,
      type: ACTIVITY_TYPES.NOTE,
      title: 'Enquiry Created',
      description: `New enquiry captured for ${lead.customerName}${lead.destination ? ` for trip to ${lead.destination}` : ''}.`,
      isCustomerContact: false,
      occurredAt: new Date(),
      metadata: { initialSource: lead.leadSource }
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry created successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(req, res, next) {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      businessId: req.user.businessId // Strict tenant isolation
    }).populate('createdBy', 'name email').lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      lead
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    const validatedData = updateLeadSchema.parse(req.body);

    const lead = await Lead.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    // Apply allowed updates
    Object.assign(lead, validatedData);
    lead.lastActivityAt = new Date();
    await lead.save();

    // Log requirement update activity
    await LeadActivity.create({
      businessId: req.user.businessId,
      leadId: lead._id,
      userId: req.user._id,
      type: ACTIVITY_TYPES.REQUIREMENT_UPDATE,
      title: 'Trip Requirements Updated',
      description: 'Travel specs or enquiry parameters were updated.',
      isCustomerContact: false,
      occurredAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStage(req, res, next) {
  try {
    const validatedData = stageUpdateSchema.parse(req.body);
    const { toStage, note, quotationAmount, lostReason } = validatedData;

    const lead = await Lead.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    const currentStage = lead.stage;

    // 1. Prevent ordinary stage changes on terminal leads
    if (TERMINAL_STAGES.includes(currentStage)) {
      return res.status(400).json({
        success: false,
        error: `Enquiry is currently in terminal stage "${STAGE_LABELS[currentStage]}". Reopen the enquiry deliberately to make changes.`
      });
    }

    // 2. Validate allowed stage transitions
    const allowedTargets = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];
    if (!allowedTargets.includes(toStage)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stage transition from "${STAGE_LABELS[currentStage]}" to "${STAGE_LABELS[toStage]}". Allowed transitions: ${allowedTargets.map((s) => STAGE_LABELS[s]).join(', ') || 'None'}.`
      });
    }

    // 3. Stage prerequisite validation
    if (toStage === STAGES.REQUIREMENTS_COLLECTED || toStage === STAGES.PACKAGE_PREPARATION) {
      const missing = [];
      if (!lead.destination || lead.destination.trim() === '') missing.push('destination');
      if (!lead.travelStartDate) missing.push('travel start date');
      if (lead.travellerCount === null || lead.travellerCount === undefined) missing.push('traveller count');

      if (missing.length > 0) {
        return res.status(400).json({
          success: false,
          error: `Cannot progress to "${STAGE_LABELS[toStage]}". The following requirements must be collected first: ${missing.join(', ')}. (Budget remains optional).`,
          missingFields: missing
        });
      }
    }

    if (toStage === STAGES.QUOTATION_SENT) {
      const quoteVal = quotationAmount || lead.quotationAmount;
      if (!quoteVal || quoteVal <= 0) {
        return res.status(400).json({
          success: false,
          error: 'A valid positive quotation amount is required when moving to "Quotation Sent".'
        });
      }
      lead.quotationAmount = quoteVal;
      lead.quotationSentAt = new Date();
    }

    if (toStage === STAGES.LOST) {
      if (!lostReason || lostReason.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'A reason is required when marking an enquiry as Lost.'
        });
      }
      lead.lostReason = lostReason;
    }

    // Advance stage
    lead.stage = toStage;
    lead.lastActivityAt = new Date();
    await lead.save();

    // Log stage change activity
    await LeadActivity.create({
      businessId: req.user.businessId,
      leadId: lead._id,
      userId: req.user._id,
      type: ACTIVITY_TYPES.STAGE_CHANGE,
      title: `Stage Changed to ${STAGE_LABELS[toStage]}`,
      description: note || `Enquiry moved from ${STAGE_LABELS[currentStage]} to ${STAGE_LABELS[toStage]}.`,
      isCustomerContact: false,
      occurredAt: new Date(),
      metadata: {
        fromStage: currentStage,
        toStage,
        quotationAmount: lead.quotationAmount,
        lostReason: lead.lostReason
      }
    });

    return res.status(200).json({
      success: true,
      message: `Enquiry moved to ${STAGE_LABELS[toStage]}`,
      lead
    });
  } catch (error) {
    next(error);
  }
}

export async function reopenLead(req, res, next) {
  try {
    const validatedData = reopenLeadSchema.parse(req.body);
    const { targetStage, reason } = validatedData;

    const lead = await Lead.findOne({
      _id: req.params.id,
      businessId: req.user.businessId
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    if (!TERMINAL_STAGES.includes(lead.stage)) {
      return res.status(400).json({
        success: false,
        error: `Enquiry is currently active in "${STAGE_LABELS[lead.stage]}". Only terminal enquiries can be reopened.`
      });
    }

    const previousStage = lead.stage;
    lead.stage = targetStage;
    lead.lostReason = null; // Clear lost reason on reopen
    lead.lastActivityAt = new Date();
    await lead.save();

    await LeadActivity.create({
      businessId: req.user.businessId,
      leadId: lead._id,
      userId: req.user._id,
      type: ACTIVITY_TYPES.STAGE_CHANGE,
      title: `Enquiry Deliberately Reopened`,
      description: `Reopened from ${STAGE_LABELS[previousStage]} to ${STAGE_LABELS[targetStage]}. Rationale: ${reason}`,
      isCustomerContact: false,
      occurredAt: new Date(),
      metadata: {
        fromStage: previousStage,
        toStage: targetStage,
        reopenReason: reason
      }
    });

    return res.status(200).json({
      success: true,
      message: `Enquiry reopened to ${STAGE_LABELS[targetStage]}`,
      lead
    });
  } catch (error) {
    next(error);
  }
}

export async function archiveLead(req, res, next) {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.businessId },
      { $set: { isArchived: true, lastActivityAt: new Date() } },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Enquiry archived successfully.',
      lead
    });
  } catch (error) {
    next(error);
  }
}
