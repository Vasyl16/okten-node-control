import { body, checkExact } from 'express-validator';

export const validateCreateAdvert = checkExact([
  body('title').trim().isLength({ min: 3 }).withMessage('title is required'),
  body('description').optional().isString(),
  body('priceOriginal')
    .notEmpty()
    .withMessage('priceOriginal is required')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('priceOriginal must be a positive number'),
  body('currencyOriginal')
    .notEmpty()
    .withMessage('currencyOriginal is required')
    .bail()
    .isIn(['USD', 'EUR', 'UAH'])
    .withMessage('currencyOriginal must be one of USD, EUR, UAH'),
  body('modelId')
    .notEmpty()
    .withMessage('modelId is required')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('modelId must be a positive integer'),
  body('regionId')
    .notEmpty()
    .withMessage('regionId is required')
    .bail()
    .isInt({ gt: 0 })
    .withMessage('regionId must be a positive integer'),
]);

export const validateUpdateAdvert = [
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional().isString(),
  body('priceOriginal').optional().isFloat({ gt: 0 }),
  body('currencyOriginal')
    .optional()
    .isIn(['USD', 'EUR', 'UAH'])
    .withMessage('currencyOriginal must be one of USD, EUR, UAH'),
  body('modelId').optional().isInt({ gt: 0 }),
  body('regionId').optional().isInt({ gt: 0 }),
];

