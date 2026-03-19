"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogController = __importStar(require("../controllers/catalog.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const check_permission_middlewares_1 = require("../middlewares/check-permission.middlewares");
const handle_validation_error_middlewares_1 = require("../middlewares/handle-validation-error.middlewares");
const catalog_validator_1 = require("../validators/catalog.validator");
const router = (0, express_1.Router)();
// Public catalog
router.get('/brands', catalogController.getBrands);
router.get('/brands/:id/models', catalogController.getModelsByBrandId);
router.get('/regions', catalogController.getRegions);
// Admin brand/model management
router.post('/brands', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)('admin.manage_brands'), catalog_validator_1.validateCreateBrand, handle_validation_error_middlewares_1.handleValidationError, catalogController.createBrand);
router.post('/brands/:id/models', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)('admin.manage_brands'), catalog_validator_1.validateCreateModel, handle_validation_error_middlewares_1.handleValidationError, catalogController.createModel);
// Missing brand/model requests (any authenticated user)
router.post('/requests/brand', auth_middlewares_1.checkAccessToken, catalog_validator_1.validateCreateBrandRequest, handle_validation_error_middlewares_1.handleValidationError, catalogController.createBrandRequest);
router.post('/requests/model', auth_middlewares_1.checkAccessToken, catalog_validator_1.validateCreateModelRequest, handle_validation_error_middlewares_1.handleValidationError, catalogController.createModelRequest);
// Admin view of requests
router.get('/requests/brand', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)('admin.manage_brands'), catalogController.getBrandRequests);
router.get('/requests/model', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)('admin.manage_brands'), catalogController.getModelRequests);
exports.default = router;
