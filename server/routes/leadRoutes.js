import { Router } from 'express';
import {
  listLeads,
  createLead,
  getLeadById,
  updateLead,
  updateStage,
  reopenLead,
  archiveLead
} from '../controllers/leadController.js';
import {
  listActivities,
  createActivity
} from '../controllers/activityController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// All lead endpoints require verified tenant authentication
router.use(requireAuth);

// Core Lead CRUD
router.get('/', listLeads);
router.post('/', createLead);
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', archiveLead);

// Stage Progression & Reopening
router.put('/:id/stage', updateStage);
router.post('/:id/reopen', reopenLead);

// Standardized Nested Activities under /api/leads
router.get('/:leadId/activities', listActivities);
router.post('/:leadId/activities', createActivity);

export default router;
