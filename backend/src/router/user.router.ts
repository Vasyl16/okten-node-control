import { Router } from 'express';

import * as userController from '../controllers/user.controller';
import { checkAccessToken } from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';

const router = Router();

// Current user
router.get('/me', checkAccessToken, userController.getCurrentUser);
router.patch('/me', checkAccessToken, userController.updateCurrentUser);

// Admin/manager operations
router.get(
  '',
  checkAccessToken,
  checkPermission('users.read'),
  userController.getUsers,
);

router.patch(
  '/:id/ban',
  checkAccessToken,
  checkPermission('users.ban'),
  userController.banUser,
);

router.patch(
  '/:id/unban',
  checkAccessToken,
  checkPermission('users.ban'),
  userController.unbanUser,
);

export default router;
