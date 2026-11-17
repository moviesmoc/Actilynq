import { Router } from 'express';
import { getActionQueue, snoozeAction, cancelSnooze } from '../controllers/actionController.js';
import { requireAuth, requireActiveSubscription } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.use(requireActiveSubscription);

router.get('/', getActionQueue);
router.post('/:leadId/snooze', snoozeAction);
router.delete('/:leadId/snooze', cancelSnooze);

export default router;
