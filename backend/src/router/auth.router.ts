import { Router } from 'express';

import { authController } from '../controllers/auth.controller';
import * as authMiddlware from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';
import { handleValidationError } from '../middlewares/handle-validation-error.middlewares';
import * as authValidator from '../validators/auth.validator';

const router = Router();

router.post(
  '/sign-up',
  authValidator.validateSignUpUser,
  handleValidationError,
  authController.signUpUser
);

router.post(
  '/admin/create-manager',
  authMiddlware.checkAccessToken,
  checkPermission('admin.manage_roles'),
  authValidator.validateSignUpUser,
  handleValidationError,
  authController.createManager
);

router.post(
  '/sign-in',
  authValidator.validateLoginUser,
  handleValidationError,
  authController.signInUser
);

router.post(
  '/refresh',
  authMiddlware.checkRefreshToken,
  authController.refreshToken
);

router.post(
  '/log-out',
  authMiddlware.checkAccessToken,
  authController.logOutUser
);

export default router;
