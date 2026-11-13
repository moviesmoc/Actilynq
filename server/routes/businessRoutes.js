import { Router } from 'express';
import { getBusinessProfile, updateBusinessProfile } from '../controllers/businessController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', getBusinessProfile);
router.put('/', updateBusinessProfile);

export default router;
