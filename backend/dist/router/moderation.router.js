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
const moderationController = __importStar(require("../controllers/moderation.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const check_permission_middlewares_1 = require("../middlewares/check-permission.middlewares");
const router = (0, express_1.Router)();
router.use(auth_middlewares_1.checkAccessToken);
// List ads needing moderation (needs_edit or under_review)
router.get('/ads', (0, check_permission_middlewares_1.checkPermission)('moderation.review'), moderationController.listQueue);
// Approve: set active, reset editAttempts, optional comment
router.post('/ads/:id/approve', (0, check_permission_middlewares_1.checkPermission)('moderation.approve'), moderationController.approve);
// Reject: set inactive, optional comment
router.post('/ads/:id/reject', (0, check_permission_middlewares_1.checkPermission)('moderation.reject'), moderationController.reject);
exports.default = router;
