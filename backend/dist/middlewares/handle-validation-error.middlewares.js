"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const express_validator_1 = require("express-validator");
const errors_1 = require("../errors/errors");
const handleValidationError = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        next();
        return;
    }
    const formattedErrors = errors.array().map((error) => {
        const field = 'path' in error ? error.path : '';
        return {
            name: field || error.type,
            message: error.msg,
        };
    });
    next(new errors_1.ValidationError(formattedErrors[0].message, formattedErrors));
    return;
};
exports.handleValidationError = handleValidationError;
