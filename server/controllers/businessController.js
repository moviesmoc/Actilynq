import bcrypt from 'bcryptjs';
import { Business } from '../models/Business.js';
import { User } from '../models/User.js';
import { updateBusinessSchema, createTeamMemberSchema } from '../validators/authValidator.js';

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

export async function listTeamMembers(req, res, next) {
  try {
    const business = await Business.findById(req.user.businessId).lean();
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found.' });
    }

    const users = await User.find({ businessId: req.user.businessId })
      .select('-passwordHash')
      .sort({ createdAt: 1 })
      .lean();

    const maxUsers = business.maxUsers || 2;

    return res.status(200).json({
      success: true,
      users: users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      })),
      maxUsers,
      currentCount: users.length,
      seatsRemaining: Math.max(0, maxUsers - users.length)
    });
  } catch (error) {
    next(error);
  }
}

export async function addTeamMember(req, res, next) {
  try {
    // Only owner or admin can invite/add team members
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only agency owners and administrators can add team members.'
      });
    }

    const validatedData = createTeamMemberSchema.parse(req.body);
    const { name, email, password, role } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'A user account with this email address already exists.'
      });
    }

    const business = await Business.findById(req.user.businessId);
    if (!business) {
      return res.status(404).json({ success: false, error: 'Business not found.' });
    }

    // Verify seat limit
    const currentUsersCount = await User.countDocuments({ businessId: req.user.businessId });
    const maxUsers = business.maxUsers || 2;

    if (currentUsersCount >= maxUsers) {
      return res.status(403).json({
        success: false,
        error: `Team seat limit reached (${maxUsers} users on your ${business.subscriptionPlan || 'trial'} plan). Contact sponsor at +91 7359510771 to add more user seats.`
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      businessId: business._id,
      role: role || 'agent'
    });

    return res.status(201).json({
      success: true,
      message: `Team member ${name} (${role}) added successfully.`,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function removeTeamMember(req, res, next) {
  try {
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only agency owners and administrators can remove team members.'
      });
    }

    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot remove your own user account.'
      });
    }

    const targetUser = await User.findOne({ _id: userId, businessId: req.user.businessId });
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'Team member not found in your agency.'
      });
    }

    if (targetUser.role === 'owner') {
      return res.status(400).json({
        success: false,
        error: 'The primary workspace owner cannot be removed.'
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: `Team member ${targetUser.name} has been removed from your workspace.`
    });
  } catch (error) {
    next(error);
  }
}

export async function simulateTrial(req, res, next) {
  try {
    // Only permit simulation on demo workspaces (prevents real users from extending/simulating)
    if (!req.user.isDemo) {
      return res.status(403).json({
        success: false,
        error: 'Simulation controls are strictly reserved for demonstration accounts.'
      });
    }

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
