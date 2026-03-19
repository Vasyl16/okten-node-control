import { Router } from 'express';

import * as advertController from '../controllers/advert.controller';
import { checkAccessToken } from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';
import { handleValidationError } from '../middlewares/handle-validation-error.middlewares';
import {
  validateCreateAdvert,
  validateUpdateAdvert,
} from '../validators/advert.validator';

const router = Router();

// Public read
router.get('/', advertController.listAdverts);
router.get('/:id', advertController.getAdvertById);

// Current user's adverts
router.get('/me/list', checkAccessToken, advertController.listMyAdverts);

// Statistics for own adverts (premium vs basic is enforced in service)
router.get(
  '/:id/stats',
  checkAccessToken,
  advertController.getAdvertStatistics,
);

// Create / update / delete own adverts (seller)
router.post(
  '/',
  checkAccessToken,
  checkPermission('listings.create'),
  validateCreateAdvert,
  handleValidationError,
  advertController.createAdvert,
);

router.patch(
  '/:id',
  checkAccessToken,
  checkPermission(['listings.update.own', 'listings.update.any']),
  validateUpdateAdvert,
  handleValidationError,
  advertController.updateAdvert,
);

router.delete(
  '/:id',
  checkAccessToken,
  checkPermission(['listings.delete.own', 'listings.delete.any']),
  advertController.deleteAdvert,
);

export default router;
