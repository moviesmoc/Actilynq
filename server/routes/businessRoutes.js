import { Router } from 'express';
import {
  getBusinessProfile,
  updateBusinessProfile,
  simulateTrial
} from '../controllers/businessController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getBusinessProfile);
router.put('/', updateBusinessProfile);
router.post('/simulate-trial', simulateTrial);

export default router;
