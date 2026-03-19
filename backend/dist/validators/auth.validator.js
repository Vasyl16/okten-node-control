"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginUser = exports.validateSignUpUser = void 0;
const express_validator_1 = require("express-validator");
exports.validateSignUpUser = (0, express_validator_1.checkExact)([
    (0, express_validator_1.check)('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('lastName is required'),
    (0, express_validator_1.check)('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('firstName is required'),
    (0, express_validator_1.check)('email')
        .trim()
        .isLength({ min: 1 })
        .withMessage('email is required')
        .bail()
        .isEmail()
        .withMessage('email must be valid'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 1 })
        .withMessage('Password is required')
        .bail()
        .isStrongPassword()
        .withMessage('Password must be strong'),
    (0, express_validator_1.check)('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .bail()
        .isMobilePhone('any')
        .withMessage('Phone must be valid and required'),
    (0, express_validator_1.check)('role')
        .optional()
        .isIn(['buyer', 'seller'])
        .withMessage('role must be either buyer or seller'),
]);
exports.validateLoginUser = [
    (0, express_validator_1.check)('email').notEmpty().withMessage('email is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required'),
];
