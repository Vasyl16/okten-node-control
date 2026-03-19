"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countListingsByUserId = exports.countActiveByUserId = exports.getRegionAveragePriceUah = exports.listAllAdvertsForPriceRecalc = exports.listAdvertsByStatuses = exports.listAdvertsByUserId = exports.listAdverts = exports.getAdvertById = exports.deleteAdvertById = exports.updateAdvertById = exports.createAdvert = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const createAdvert = async (dto) => {
    try {
        const [result] = await drizzle_1.db.insert(schemas_1.advertisements).values(dto).returning();
        return result;
    }
    catch (error) {
        const message = error instanceof Error && 'cause' in error
            ? String(error.cause ?? error.message)
            : String(error);
        console.error('Advert insert error:', message);
        throw new errors_1.InternalServerError('Can not create advertisement');
    }
};
exports.createAdvert = createAdvert;
const updateAdvertById = async (id, dto) => {
    try {
        const [result] = await drizzle_1.db
            .update(schemas_1.advertisements)
            .set(dto)
            .where((0, drizzle_orm_1.eq)(schemas_1.advertisements.id, id))
            .returning();
        if (!result) {
            throw new errors_1.NotFoundError('Advertisement not found');
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        const message = error instanceof Error && 'cause' in error
            ? String(error.cause ?? error.message)
            : String(error);
        console.error('Advert update error:', message);
        throw new errors_1.InternalServerError('Can not update advertisement');
    }
};
exports.updateAdvertById = updateAdvertById;
const deleteAdvertById = async (id) => {
    try {
        await drizzle_1.db.delete(schemas_1.advertisements).where((0, drizzle_orm_1.eq)(schemas_1.advertisements.id, id));
    }
    catch {
        throw new errors_1.InternalServerError('Can not delete advertisement');
    }
};
exports.deleteAdvertById = deleteAdvertById;
const getAdvertById = async (id) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.eq)(schemas_1.advertisements.id, id));
        if (!result) {
            throw new errors_1.NotFoundError('Advertisement not found');
        }
        return result;
    }
    catch (error) {
        // Surface "not found" to the API layer instead of hiding behind 500
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.NotFoundError('Advertisement not found');
    }
};
exports.getAdvertById = getAdvertById;
const listAdverts = async () => {
    try {
        return await drizzle_1.db
            .select()
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.eq)(schemas_1.advertisements.status, 'active'))
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.advertisements.createdAt));
    }
    catch {
        throw new errors_1.InternalServerError('Can not get advertisements');
    }
};
exports.listAdverts = listAdverts;
const listAdvertsByUserId = async (userId) => {
    try {
        return await drizzle_1.db
            .select()
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.eq)(schemas_1.advertisements.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.advertisements.createdAt));
    }
    catch {
        throw new errors_1.InternalServerError('Can not get advertisements');
    }
};
exports.listAdvertsByUserId = listAdvertsByUserId;
const listAdvertsByStatuses = async (statuses) => {
    try {
        return await drizzle_1.db
            .select()
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.inArray)(schemas_1.advertisements.status, statuses))
            .orderBy((0, drizzle_orm_1.desc)(schemas_1.advertisements.updatedAt));
    }
    catch {
        throw new errors_1.InternalServerError('Can not get advertisements');
    }
};
exports.listAdvertsByStatuses = listAdvertsByStatuses;
const listAllAdvertsForPriceRecalc = async () => {
    try {
        return await drizzle_1.db
            .select({
            id: schemas_1.advertisements.id,
            priceOriginal: schemas_1.advertisements.priceOriginal,
            currencyOriginal: schemas_1.advertisements.currencyOriginal,
        })
            .from(schemas_1.advertisements);
    }
    catch {
        throw new errors_1.InternalServerError('Can not get advertisements');
    }
};
exports.listAllAdvertsForPriceRecalc = listAllAdvertsForPriceRecalc;
const getRegionAveragePriceUah = async (regionId) => {
    try {
        const [row] = await drizzle_1.db
            .select({
            value: (0, drizzle_orm_1.avg)(schemas_1.advertisements.priceUah).as('value'),
        })
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertisements.regionId, regionId), (0, drizzle_orm_1.eq)(schemas_1.advertisements.status, 'active')));
        return row?.value !== null && row?.value !== undefined
            ? Number(row.value)
            : 0;
    }
    catch {
        throw new errors_1.InternalServerError('Can not calculate region average price');
    }
};
exports.getRegionAveragePriceUah = getRegionAveragePriceUah;
const countActiveByUserId = async (userId) => {
    try {
        const [row] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertisements.userId, userId), (0, drizzle_orm_1.eq)(schemas_1.advertisements.status, 'active')));
        return Number(row?.value ?? 0);
    }
    catch {
        throw new errors_1.InternalServerError('Can not count advertisements');
    }
};
exports.countActiveByUserId = countActiveByUserId;
/** Count ads that count toward basic-account limit: active, needs_edit, under_review (excludes inactive) */
const countListingsByUserId = async (userId) => {
    try {
        const [row] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(schemas_1.advertisements)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertisements.userId, userId), (0, drizzle_orm_1.inArray)(schemas_1.advertisements.status, ['active', 'needs_edit', 'under_review'])));
        return Number(row?.value ?? 0);
    }
    catch {
        throw new errors_1.InternalServerError('Can not count advertisements');
    }
};
exports.countListingsByUserId = countListingsByUserId;
