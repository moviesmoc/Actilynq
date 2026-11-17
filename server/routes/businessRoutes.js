import { Router } from 'express';
import {
  getBusinessProfile,
  updateBusinessProfile,
  simulateTrial,
  listTeamMembers,
  addTeamMember,
  removeTeamMember
} from '../controllers/businessController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getBusinessProfile);
router.put('/', updateBusinessProfile);
router.post('/simulate-trial', simulateTrial);

// Multi-User Team Member Management
router.get('/users', listTeamMembers);
router.post('/users', addTeamMember);
router.delete('/users/:userId', removeTeamMember);

export default router;
