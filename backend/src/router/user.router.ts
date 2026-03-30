import { Router } from 'express';

import * as userController from '../controllers/user.controller';
import { checkAccessToken } from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';
import { handleValidationError } from '../middlewares/handle-validation-error.middlewares';
import { validateUpdateCurrentUser } from '../validators/user.validator';

const router = Router();

// Current user
router.get('/me', checkAccessToken, userController.getCurrentUser);
router.patch(
  '/me',
  checkAccessToken,
  validateUpdateCurrentUser,
  handleValidationError,
  userController.updateCurrentUser,
);

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
