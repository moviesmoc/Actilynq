import { Router } from 'express';
import { getActionQueue, snoozeAction, cancelSnooze } from '../controllers/actionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', getActionQueue);
router.post('/:leadId/snooze', snoozeAction);
router.delete('/:leadId/snooze', cancelSnooze);

export default router;
