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
exports.advertService = void 0;
const accountTypeRepo = __importStar(require("../db/repos/account-type.repo"));
const advertViewStatsRepo = __importStar(require("../db/repos/advert-view-stats.repo"));
const advertRepo = __importStar(require("../db/repos/advert.repo"));
const modelRepo = __importStar(require("../db/repos/model.repo"));
const regionRepo = __importStar(require("../db/repos/region.repo"));
const roleRepo = __importStar(require("../db/repos/role.repo"));
const userRepo = __importStar(require("../db/repos/user.repo"));
const errors_1 = require("../errors/errors");
const currency_service_1 = require("./currency.service");
const profanity_service_1 = require("./profanity.service");
class AdvertService {
    async recalcAllAdPrices() {
        const rates = await (0, currency_service_1.getLatestRates)();
        const adverts = await advertRepo.listAllAdvertsForPriceRecalc();
        const updatedAt = new Date();
        for (const advert of adverts) {
            const amount = Number(advert.priceOriginal);
            const currency = advert.currencyOriginal;
            if (!Number.isFinite(amount)) {
                throw new errors_1.InternalServerError(`Invalid stored priceOriginal for advertId=${advert.id}`);
            }
            const converted = (0, currency_service_1.convertPriceWithRates)(amount, currency, rates);
            await advertRepo.updateAdvertById(advert.id, {
                priceUsd: String(converted.priceUsd),
                priceEur: String(converted.priceEur),
                priceUah: String(converted.priceUah),
                updatedAt,
            });
        }
        return { updated: adverts.length };
    }
    async createAdvert(userId, payload) {
        const user = await userRepo.getById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        if (user.isBanned) {
            throw new errors_1.BadRequestError('Banned users cannot create advertisements');
        }
        // Validate model and region to provide clear errors instead of FK violations
        await Promise.all([
            modelRepo.getModelById(payload.modelId),
            regionRepo.getRegionById(payload.regionId),
        ]);
        const accountType = await accountTypeRepo.getAccountTypeByName('basic');
        const isBasic = user.accountTypeId === accountType.id;
        if (isBasic) {
            const listingCount = await advertRepo.countListingsByUserId(userId);
            if (listingCount >= (accountType.maxListings ?? 1)) {
                throw new errors_1.BadRequestError('Basic account can only have one advertisement (active or pending). Delete or deactivate the existing one to create another.');
            }
        }
        const { priceOriginal, currencyOriginal } = payload;
        const converted = await (0, currency_service_1.convertPrice)(priceOriginal, currencyOriginal);
        const hasBadLanguage = (0, profanity_service_1.hasProfanity)(payload.title) ||
            (payload.description ? (0, profanity_service_1.hasProfanity)(payload.description) : false);
        const status = hasBadLanguage ? 'needs_edit' : 'active';
        const editAttempts = hasBadLanguage ? 1 : 0;
        const advert = await advertRepo.createAdvert({
            title: payload.title,
            description: payload.description ?? null,
            priceOriginal: String(priceOriginal),
            currencyOriginal,
            priceUsd: String(converted.priceUsd),
            priceEur: String(converted.priceEur),
            priceUah: String(converted.priceUah),
            modelId: payload.modelId,
            regionId: payload.regionId,
            userId,
            status,
            editAttempts,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        // Return the ad either way; client can check status and show warning if needs_edit
        return advert;
    }
    async updateAdvert(advertId, userId, dto) {
        const advert = await advertRepo.getAdvertById(advertId);
        const caller = await userRepo.getById(userId);
        if (!caller) {
            throw new errors_1.NotFoundError('User not found');
        }
        const [managerRole, adminRole] = await Promise.all([
            roleRepo.getRoleByName('manager'),
            roleRepo.getRoleByName('admin'),
        ]);
        const isOwner = advert.userId === userId;
        const isManagerOrAdmin = caller.roleId === managerRole.id || caller.roleId === adminRole.id;
        if (!isOwner && !isManagerOrAdmin) {
            throw new errors_1.BadRequestError('You can update only your own advertisements');
        }
        if (advert.status === 'inactive' && !isManagerOrAdmin) {
            throw new errors_1.BadRequestError('Inactive advertisements cannot be updated; you can only delete them.');
        }
        if (dto.regionId !== undefined) {
            await regionRepo.getRegionById(dto.regionId);
        }
        if (dto.modelId !== undefined) {
            await modelRepo.getModelById(dto.modelId);
        }
        let status = advert.status;
        let editAttempts = advert.editAttempts;
        let priceOriginal = Number(advert.priceOriginal);
        let currencyOriginal = advert.currencyOriginal;
        if (dto.priceOriginal !== undefined && dto.currencyOriginal !== undefined) {
            priceOriginal = dto.priceOriginal;
            currencyOriginal = dto.currencyOriginal;
        }
        const converted = await (0, currency_service_1.convertPrice)(priceOriginal, currencyOriginal);
        if (dto.title || dto.description) {
            const newTitle = dto.title ?? advert.title;
            const newDescription = dto.description ?? advert.description ?? '';
            if (isManagerOrAdmin) {
                // Manager/admin bypass profanity and edit attempts and can reactivate
                status = 'active';
                editAttempts = 0;
            }
            else {
                const hasBadLanguage = (0, profanity_service_1.hasProfanity)(newTitle) || (0, profanity_service_1.hasProfanity)(newDescription);
                if (hasBadLanguage) {
                    editAttempts = advert.editAttempts + 1;
                    status = editAttempts >= 3 ? 'inactive' : 'needs_edit';
                }
                else {
                    status = 'active';
                    editAttempts = 0;
                }
            }
        }
        return advertRepo.updateAdvertById(advertId, {
            title: dto.title ?? advert.title,
            description: dto.description ?? advert.description,
            priceOriginal: String(priceOriginal),
            currencyOriginal,
            priceUsd: String(converted.priceUsd),
            priceEur: String(converted.priceEur),
            priceUah: String(converted.priceUah),
            modelId: dto.modelId ?? advert.modelId,
            regionId: dto.regionId ?? advert.regionId,
            status,
            editAttempts,
            updatedAt: new Date(),
        });
    }
    async deleteAdvert(advertId, userId) {
        const advert = await advertRepo.getAdvertById(advertId);
        // Owner can delete any of their own adverts.
        // Managers/admins (with proper permissions) are allowed by design to delete
        // inactive adverts even if they are not the owner.
        if (advert.userId !== userId && advert.status !== 'inactive') {
            throw new errors_1.BadRequestError('You can delete only your own advertisements');
        }
        await advertRepo.deleteAdvertById(advertId);
    }
    async getAdvertById(id) {
        const advert = await advertRepo.getAdvertById(id);
        // fire-and-forget view increment
        advertViewStatsRepo
            .incrementView(advert.id, new Date())
            .catch(() => undefined);
        return advert;
    }
    listAdverts() {
        return advertRepo.listAdverts();
    }
    async getAdvertStatistics(advertId, userId) {
        const advert = await advertRepo.getAdvertById(advertId);
        const user = await userRepo.getById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        const premiumAccountType = await accountTypeRepo.getAccountTypeByName('premium');
        const isOwner = advert.userId === userId;
        const isPremiumAccount = user.accountTypeId === premiumAccountType.id;
        if (!isOwner) {
            throw new errors_1.BadRequestError('You can view statistics only for your own advertisements');
        }
        if (!isPremiumAccount) {
            throw new errors_1.BadRequestError('Statistics are available only for premium accounts');
        }
        const [viewsStats, avgPriceUah] = await Promise.all([
            advertViewStatsRepo.getViewsStats(advertId, new Date()),
            advertRepo.getRegionAveragePriceUah(advert.regionId),
        ]);
        return {
            ...viewsStats,
            averagePriceRegionUah: avgPriceUah,
        };
    }
    listAdvertsByUser(userId) {
        return advertRepo.listAdvertsByUserId(userId);
    }
}
exports.advertService = new AdvertService();
