import { Lead } from '../models/Lead.js';
import { LeadActivity } from '../models/LeadActivity.js';
import { deriveIsCustomerContact } from '../constants/workflow.js';
import { createActivitySchema } from '../validators/activityValidator.js';

export async function listActivities(req, res, next) {
  try {
    const { leadId } = req.params;

    // Verify lead belongs to authenticated tenant
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

    const activities = await LeadActivity.find({
      leadId,
      businessId: req.user.businessId
    })
      .populate('userId', 'name email')
      .sort({ occurredAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      activities
    });
  } catch (error) {
    next(error);
  }
}

export async function createActivity(req, res, next) {
  try {
    const { leadId } = req.params;
    const validatedData = createActivitySchema.parse(req.body);
    const {
      type,
      title,
      description,
      occurredAt,
      contactOutcome,
      nextFollowUpAt,
      clearFollowUp,
      metadata = {}
    } = validatedData;

    // Strict tenant isolation verification
    const lead = await Lead.findOne({
      _id: leadId,
      businessId: req.user.businessId
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: 'Lead not found or access denied.'
      });
    }

    // Derive whether this counts as confirmed customer contact STRICTLY on the backend
    const isContact = deriveIsCustomerContact(type, contactOutcome);

    const activityDate = occurredAt ? new Date(occurredAt) : new Date();

    const activity = await LeadActivity.create({
      businessId: req.user.businessId,
      leadId: lead._id,
      userId: req.user._id,
      type,
      title,
      description,
      occurredAt: activityDate,
      isCustomerContact: isContact,
      metadata: {
        ...metadata,
        contactOutcome: contactOutcome || null
      }
    });

    // 1. Update lastActivityAt on the lead (for all meaningful activities)
    lead.lastActivityAt = activityDate;

    // 2. Update lastCustomerContactAt ONLY when confirmed customer contact occurred
    if (isContact) {
      lead.lastCustomerContactAt = activityDate;
    }

    // 3. Update or clear salesperson-scheduled follow-up
    if (clearFollowUp === true) {
      lead.nextFollowUpAt = null;
    } else if (nextFollowUpAt) {
      lead.nextFollowUpAt = new Date(nextFollowUpAt);
    }

    await lead.save();

    return res.status(201).json({
      success: true,
      message: 'Activity recorded successfully',
      activity,
      lead
    });
  } catch (error) {
    next(error);
  }
}
