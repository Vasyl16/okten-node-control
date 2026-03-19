"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateModelRequest = exports.validateCreateBrandRequest = exports.validateCreateModel = exports.validateCreateBrand = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateBrand = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('name is required (2-100 characters)'),
]);
exports.validateCreateModel = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('name is required (1-100 characters)'),
]);
exports.validateCreateBrandRequest = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)('requestedName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('requestedName is required (2-100 characters)'),
    (0, express_validator_1.body)('comment')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('comment must be a string (max 500 characters)'),
]);
exports.validateCreateModelRequest = (0, express_validator_1.checkExact)([
    (0, express_validator_1.body)('brandId')
        .notEmpty()
        .withMessage('brandId is required')
        .bail()
        .isInt({ gt: 0 })
        .withMessage('brandId must be a positive integer'),
    (0, express_validator_1.body)('requestedName')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('requestedName is required (1-100 characters)'),
    (0, express_validator_1.body)('comment')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('comment must be a string (max 500 characters)'),
]);
