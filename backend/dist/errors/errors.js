"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayloadTooLarge = exports.UnathorizedError = exports.ValidationError = exports.ForbiddenError = exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.ConflictError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.AppError = AppError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends BadRequestError {
    constructor(message, fields) {
        super(message);
        this.fields = fields;
    }
}
exports.ValidationError = ValidationError;
class UnathorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnathorizedError = UnathorizedError;
class PayloadTooLarge extends AppError {
    constructor(message) {
        super(message, 413);
    }
}
exports.PayloadTooLarge = PayloadTooLarge;
