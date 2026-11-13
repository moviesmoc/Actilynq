import { Lead } from '../models/Lead.js';
import { LeadActivity } from '../models/LeadActivity.js';
import { ActionOverride } from '../models/ActionOverride.js';
import { populateDemoLeadsForBusiness } from '../seed/demoSeed.js';

export async function resetDemoWorkspace(req, res, next) {
  try {
    // Safety check: ONLY allow reset if the business account is flagged as demo
    if (!req.user.isDemo) {
      return res.status(403).json({
        success: false,
        error: 'Demo reset operation is strictly permitted only on the designated demo workspace. Production workspaces cannot be reset.'
      });
    }

    const businessId = req.user.businessId;

    // Remove strictly this demo tenant's records — never affects other businesses!
    await Promise.all([
      Lead.deleteMany({ businessId }),
      LeadActivity.deleteMany({ businessId }),
      ActionOverride.deleteMany({ businessId })
    ]);

    // Re-populate with fresh relative dates
    await populateDemoLeadsForBusiness(businessId, req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Demo workspace successfully reset with 11 refreshed travel scenarios.'
    });
  } catch (error) {
    next(error);
  }
}
