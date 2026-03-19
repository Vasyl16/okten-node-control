import { Router } from 'express';

import * as catalogController from '../controllers/catalog.controller';
import { checkAccessToken } from '../middlewares/auth.middlewares';
import { checkPermission } from '../middlewares/check-permission.middlewares';
import { handleValidationError } from '../middlewares/handle-validation-error.middlewares';
import {
  validateCreateBrand,
  validateCreateModel,
  validateCreateBrandRequest,
  validateCreateModelRequest,
} from '../validators/catalog.validator';

const router = Router();

// Public catalog
router.get('/brands', catalogController.getBrands);
router.get('/brands/:id/models', catalogController.getModelsByBrandId);
router.get('/regions', catalogController.getRegions);

// Admin brand/model management
router.post(
  '/brands',
  checkAccessToken,
  checkPermission('admin.manage_brands'),
  validateCreateBrand,
  handleValidationError,
  catalogController.createBrand,
);

router.post(
  '/brands/:id/models',
  checkAccessToken,
  checkPermission('admin.manage_brands'),
  validateCreateModel,
  handleValidationError,
  catalogController.createModel,
);

// Missing brand/model requests (any authenticated user)
router.post(
  '/requests/brand',
  checkAccessToken,
  validateCreateBrandRequest,
  handleValidationError,
  catalogController.createBrandRequest,
);

router.post(
  '/requests/model',
  checkAccessToken,
  validateCreateModelRequest,
  handleValidationError,
  catalogController.createModelRequest,
);

// Admin view of requests
router.get(
  '/requests/brand',
  checkAccessToken,
  checkPermission('admin.manage_brands'),
  catalogController.getBrandRequests,
);

router.get(
  '/requests/model',
  checkAccessToken,
  checkPermission('admin.manage_brands'),
  catalogController.getModelRequests,
);

export default router;

