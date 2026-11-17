import { Business } from '../models/Business.js';
import { updateBusinessSchema } from '../validators/authValidator.js';

export async function getBusinessProfile(req, res, next) {
  try {
    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found.' });
    }
    return res.status(200).json({ success: true, business });
  } catch (error) {
    next(error);
  }
}

export async function updateBusinessProfile(req, res, next) {
  try {
    const validatedData = updateBusinessSchema.parse(req.body);
    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { $set: validatedData },
      { new: true, runValidators: true }
    );
    return res.status(200).json({ success: true, business });
  } catch (error) {
    next(error);
  }
}

export async function simulateTrial(req, res, next) {
  try {
    const { expireNow, daysRemaining = 14 } = req.body;
    const newExpiresAt = expireNow 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day in the past (expired)
      : new Date(Date.now() + Number(daysRemaining) * 24 * 60 * 60 * 1000);

    const business = await Business.findByIdAndUpdate(
      req.user.businessId,
      { $set: { subscriptionExpiresAt: newExpiresAt } },
      { new: true }
    );

    const now = new Date();
    const isTrialExpired = Boolean(newExpiresAt && now > newExpiresAt);
    const calculatedDays = isTrialExpired ? 0 : Math.max(0, Math.ceil((newExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return res.status(200).json({
      success: true,
      message: expireNow ? 'Trial simulated as expired' : `Trial set to ${daysRemaining} days remaining`,
      business: {
        id: business._id,
        name: business.name,
        currency: business.currency,
        subscriptionPlan: business.subscriptionPlan || 'trial',
        subscriptionExpiresAt: business.subscriptionExpiresAt,
        isTrialExpired,
        daysRemaining: calculatedDays
      }
    });
  } catch (error) {
    next(error);
  }
}
