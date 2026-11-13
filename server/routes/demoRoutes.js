import { Router } from 'express';
import { resetDemoWorkspace } from '../controllers/demoController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/reset', resetDemoWorkspace);

export default router;
