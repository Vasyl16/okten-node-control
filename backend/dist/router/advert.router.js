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
const advertController = __importStar(require("../controllers/advert.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const check_permission_middlewares_1 = require("../middlewares/check-permission.middlewares");
const handle_validation_error_middlewares_1 = require("../middlewares/handle-validation-error.middlewares");
const advert_validator_1 = require("../validators/advert.validator");
const router = (0, express_1.Router)();
// Public read
router.get('/', advertController.listAdverts);
router.get('/:id', advertController.getAdvertById);
// Current user's adverts
router.get('/me/list', auth_middlewares_1.checkAccessToken, advertController.listMyAdverts);
// Statistics for own adverts (premium vs basic is enforced in service)
router.get('/:id/stats', auth_middlewares_1.checkAccessToken, advertController.getAdvertStatistics);
// Create / update / delete own adverts (seller)
router.post('/', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)('listings.create'), advert_validator_1.validateCreateAdvert, handle_validation_error_middlewares_1.handleValidationError, advertController.createAdvert);
router.patch('/:id', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)(['listings.update.own', 'listings.update.any']), advert_validator_1.validateUpdateAdvert, handle_validation_error_middlewares_1.handleValidationError, advertController.updateAdvert);
router.delete('/:id', auth_middlewares_1.checkAccessToken, (0, check_permission_middlewares_1.checkPermission)(['listings.delete.own', 'listings.delete.any']), advertController.deleteAdvert);
exports.default = router;
