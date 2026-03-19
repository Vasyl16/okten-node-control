import { body, checkExact } from 'express-validator';

export const validateCreateBrand = checkExact([
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('name is required (2-100 characters)'),
]);

export const validateCreateModel = checkExact([
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('name is required (1-100 characters)'),
]);

export const validateCreateBrandRequest = checkExact([
  body('requestedName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('requestedName is required (2-100 characters)'),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('comment must be a string (max 500 characters)'),
]);

export const validateCreateModelRequest = checkExact([
  body('brandId')
    .notEmpty()
    .withMessage('brandId is required')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('brandId must be a positive integer'),
  body('requestedName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('requestedName is required (1-100 characters)'),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('comment must be a string (max 500 characters)'),
]);

