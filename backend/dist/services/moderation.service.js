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
exports.moderationService = void 0;
const advertRepo = __importStar(require("../db/repos/advert.repo"));
const errors_1 = require("../errors/errors");
const MODERATION_STATUSES = ['needs_edit', 'under_review', 'inactive'];
const CAN_APPROVE_STATUSES = ['needs_edit', 'under_review', 'inactive'];
const CAN_REJECT_STATUSES = ['needs_edit', 'under_review'];
class ModerationService {
    async listQueue() {
        return advertRepo.listAdvertsByStatuses([...MODERATION_STATUSES]);
    }
    async approve(advertId, comment) {
        const advert = await advertRepo.getAdvertById(advertId);
        if (!CAN_APPROVE_STATUSES.includes(advert.status)) {
            throw new errors_1.NotFoundError('Advertisement not found or cannot be approved');
        }
        return advertRepo.updateAdvertById(advertId, {
            status: 'active',
            editAttempts: 0,
            moderationComment: comment ?? null,
            updatedAt: new Date(),
        });
    }
    async reject(advertId, comment) {
        const advert = await advertRepo.getAdvertById(advertId);
        if (!CAN_REJECT_STATUSES.includes(advert.status)) {
            throw new errors_1.NotFoundError('Advertisement not found or cannot be rejected');
        }
        return advertRepo.updateAdvertById(advertId, {
            status: 'inactive',
            moderationComment: comment ?? null,
            updatedAt: new Date(),
        });
    }
}
exports.moderationService = new ModerationService();
