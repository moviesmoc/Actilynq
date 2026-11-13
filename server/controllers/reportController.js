import { Lead } from '../models/Lead.js';
import { LeadActivity } from '../models/LeadActivity.js';
import { ActionOverride } from '../models/ActionOverride.js';
import { STAGES, TERMINAL_STAGES, STAGE_LABELS } from '../constants/workflow.js';
import { evaluateAllLeads } from '../services/nextActionEngine.js';

export async function getDashboardSummary(req, res, next) {
  try {
    const businessId = req.user.businessId;
    const now = new Date();

    const [
      totalOpen,
      quotationsSent,
      confirmedWon,
      lostCount,
      overdueCallbacks,
      openLeads,
      recentActivities,
      activeOverrides
    ] = await Promise.all([
      Lead.countDocuments({
        businessId,
        isArchived: false,
        stage: { $nin: TERMINAL_STAGES }
      }),
      Lead.countDocuments({
        businessId,
        isArchived: false,
        quotationSentAt: { $ne: null }
      }),
      Lead.countDocuments({
        businessId,
        isArchived: false,
        stage: STAGES.BOOKING_CONFIRMED
      }),
      Lead.countDocuments({
        businessId,
        isArchived: false,
        stage: STAGES.LOST
      }),
      Lead.countDocuments({
        businessId,
        isArchived: false,
        stage: { $nin: TERMINAL_STAGES },
        nextFollowUpAt: { $lt: now }
      }),
      Lead.find({
        businessId,
        isArchived: false,
        stage: { $nin: TERMINAL_STAGES }
      }).lean(),
      LeadActivity.find({ businessId })
        .populate('userId', 'name')
        .populate('leadId', 'customerName destination')
        .sort({ occurredAt: -1 })
        .limit(6)
        .lean(),
      ActionOverride.find({
        businessId,
        snoozeUntil: { $gt: now }
      }).lean()
    ]);

    // Calculate pipeline value from actual database records
    const pipelineEstimatedValue = openLeads.reduce(
      (sum, lead) => sum + (lead.estimatedValue || 0),
      0
    );

    // Compute active recommendations queue
    const allRecommendations = evaluateAllLeads(openLeads, activeOverrides, now);
    const urgentRecommendations = allRecommendations.slice(0, 3);

    // Aggregate leads by stage
    const stageCounts = {};
    for (const s of Object.values(STAGES)) {
      stageCounts[s] = 0;
    }
    const allLeads = await Lead.find({ businessId, isArchived: false }).select('stage').lean();
    for (const l of allLeads) {
      if (stageCounts[l.stage] !== undefined) {
        stageCounts[l.stage]++;
      }
    }

    const stageBreakdown = Object.entries(stageCounts).map(([stage, count]) => ({
      stage,
      label: STAGE_LABELS[stage] || stage,
      count
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalOpen,
        quotationsSent,
        confirmedWon,
        lostCount,
        overdueCallbacks,
        actionsRequiringAttention: allRecommendations.length,
        pipelineEstimatedValue,
        currency: req.user.currency || 'INR'
      },
      urgentRecommendations,
      stageBreakdown,
      recentActivities
    });
  } catch (error) {
    next(error);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const businessId = req.user.businessId;

    const leads = await Lead.find({ businessId, isArchived: false }).lean();

    const stageDistribution = {};
    const sourceDistribution = {};
    const travelTypeDistribution = {};

    let totalWon = 0;
    let totalLost = 0;
    let totalValueWon = 0;

    for (const lead of leads) {
      // Stage
      stageDistribution[lead.stage] = (stageDistribution[lead.stage] || 0) + 1;
      // Source
      sourceDistribution[lead.leadSource] = (sourceDistribution[lead.leadSource] || 0) + 1;
      // Travel Type
      travelTypeDistribution[lead.travelType] = (travelTypeDistribution[lead.travelType] || 0) + 1;

      if (lead.stage === STAGES.BOOKING_CONFIRMED) {
        totalWon++;
        totalValueWon += lead.quotationAmount || lead.estimatedValue || 0;
      } else if (lead.stage === STAGES.LOST) {
        totalLost++;
      }
    }

    const closedCount = totalWon + totalLost;
    const winRate = closedCount > 0 ? Math.round((totalWon / closedCount) * 100) : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        totalEnquiries: leads.length,
        totalWon,
        totalLost,
        winRate,
        totalValueWon,
        currency: req.user.currency || 'INR',
        byStage: Object.entries(stageDistribution).map(([stage, count]) => ({
          stage,
          label: STAGE_LABELS[stage] || stage,
          count
        })),
        bySource: Object.entries(sourceDistribution).map(([source, count]) => ({
          source,
          count
        })),
        byTravelType: Object.entries(travelTypeDistribution).map(([type, count]) => ({
          type,
          count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}
