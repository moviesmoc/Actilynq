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
