import { Router } from 'express';
import { getDashboardSummary, getAnalytics } from '../controllers/reportController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', getDashboardSummary);
router.get('/analytics', getAnalytics);

export default router;
