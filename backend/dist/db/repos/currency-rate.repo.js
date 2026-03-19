"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePrivatRate = exports.getLatestRate = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getLatestRate = async () => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(schemas_1.currencyRates)
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.currencyRates.createdAt))
            .limit(1);
        if (!result) {
            throw new errors_1.NotFoundError('Currency rates not found');
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not get currency rates');
    }
};
exports.getLatestRate = getLatestRate;
const savePrivatRate = async (params) => {
    try {
        // First try to update existing privatbank row
        const [updated] = await drizzle_1.db
            .update(schemas_1.currencyRates)
            .set({
            usdToUah: params.usdToUah,
            eurToUah: params.eurToUah,
            createdAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schemas_1.currencyRates.provider, 'privatbank'))
            .returning();
        if (updated) {
            return updated;
        }
        // If nothing to update (no row yet), insert one
        const [inserted] = await drizzle_1.db
            .insert(schemas_1.currencyRates)
            .values({
            provider: 'privatbank',
            usdToUah: params.usdToUah,
            eurToUah: params.eurToUah,
        })
            .returning();
        return inserted;
    }
    catch {
        throw new errors_1.InternalServerError('Can not save currency rate');
    }
};
exports.savePrivatRate = savePrivatRate;
