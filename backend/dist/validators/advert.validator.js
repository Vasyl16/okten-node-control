"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateAdvert = exports.validateCreateAdvert = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateAdvert = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)('title').trim().isLength({ min: 3 }).withMessage('title is required'),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('priceOriginal')
        .notEmpty()
        .withMessage('priceOriginal is required')
        .bail()
        .isFloat({ gt: 0 })
        .withMessage('priceOriginal must be a positive number'),
    (0, express_validator_1.body)('currencyOriginal')
        .notEmpty()
        .withMessage('currencyOriginal is required')
        .bail()
        .isIn(['USD', 'EUR', 'UAH'])
        .withMessage('currencyOriginal must be one of USD, EUR, UAH'),
    (0, express_validator_1.body)('modelId')
        .notEmpty()
        .withMessage('modelId is required')
        .bail()
        .isInt({ gt: 0 })
        .withMessage('modelId must be a positive integer'),
    (0, express_validator_1.body)('regionId')
        .notEmpty()
        .withMessage('regionId is required')
        .bail()
        .isInt({ gt: 0 })
        .withMessage('regionId must be a positive integer'),
]);
exports.validateUpdateAdvert = [
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 3 }),
    (0, express_validator_1.body)('description').optional().isString(),
    (0, express_validator_1.body)('priceOriginal').optional().isFloat({ gt: 0 }),
    (0, express_validator_1.body)('currencyOriginal')
        .optional()
        .isIn(['USD', 'EUR', 'UAH'])
        .withMessage('currencyOriginal must be one of USD, EUR, UAH'),
    (0, express_validator_1.body)('modelId').optional().isInt({ gt: 0 }),
    (0, express_validator_1.body)('regionId').optional().isInt({ gt: 0 }),
];
