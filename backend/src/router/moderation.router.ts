import { Router } from 'express';

import * as moderationController from '../controllers/moderation.controller';
import { checkAccessToken } from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';

const router = Router();

router.use(checkAccessToken);

// List ads needing moderation (needs_edit or under_review)
router.get(
  '/ads',
  checkPermission('moderation.review'),
  moderationController.listQueue,
);

// Approve: set active, reset editAttempts, optional comment
router.post(
  '/ads/:id/approve',
  checkPermission('moderation.approve'),
  moderationController.approve,
);

// Reject: set inactive, optional comment
router.post(
  '/ads/:id/reject',
  checkPermission('moderation.reject'),
  moderationController.reject,
);

export default router;
