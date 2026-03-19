"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getViewsStats = exports.incrementView = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const toDayDate = (date) => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
const incrementView = async (advertId, at) => {
    const day = toDayDate(at);
    try {
        const [existing] = await drizzle_1.db
            .select()
            .from(schemas_1.advertViewStats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.advertId, advertId), (0, drizzle_orm_1.eq)(schemas_1.advertViewStats.day, day)));
        if (existing) {
            const [updated] = await drizzle_1.db
                .update(schemas_1.advertViewStats)
                .set({ views: existing.views + 1 })
                .where((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.id, existing.id))
                .returning();
            return updated;
        }
        const [inserted] = await drizzle_1.db
            .insert(schemas_1.advertViewStats)
            .values({ advertId, day, views: 1 })
            .returning();
        return inserted;
    }
    catch {
        throw new errors_1.InternalServerError('Can not update advert view stats');
    }
};
exports.incrementView = incrementView;
const getViewsStats = async (advertId, now) => {
    const today = toDayDate(now);
    const msPerDay = 24 * 60 * 60 * 1000;
    const dayAgo = new Date(today.getTime() - 1 * msPerDay);
    const weekAgo = new Date(today.getTime() - 7 * msPerDay);
    const monthAgo = new Date(today.getTime() - 30 * msPerDay);
    try {
        const [rowTotal] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.sum)(schemas_1.advertViewStats.views).as('value') })
            .from(schemas_1.advertViewStats)
            .where((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.advertId, advertId));
        const [rowDay] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.sum)(schemas_1.advertViewStats.views).as('value') })
            .from(schemas_1.advertViewStats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.advertId, advertId), (0, drizzle_orm_1.gte)(schemas_1.advertViewStats.day, dayAgo)));
        const [rowWeek] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.sum)(schemas_1.advertViewStats.views).as('value') })
            .from(schemas_1.advertViewStats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.advertId, advertId), (0, drizzle_orm_1.gte)(schemas_1.advertViewStats.day, weekAgo)));
        const [rowMonth] = await drizzle_1.db
            .select({ value: (0, drizzle_orm_1.sum)(schemas_1.advertViewStats.views).as('value') })
            .from(schemas_1.advertViewStats)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schemas_1.advertViewStats.advertId, advertId), (0, drizzle_orm_1.gte)(schemas_1.advertViewStats.day, monthAgo)));
        return {
            totalViews: Number(rowTotal?.value ?? 0),
            viewsLastDay: Number(rowDay?.value ?? 0),
            viewsLastWeek: Number(rowWeek?.value ?? 0),
            viewsLastMonth: Number(rowMonth?.value ?? 0),
        };
    }
    catch {
        throw new errors_1.InternalServerError('Can not read advert view stats');
    }
};
exports.getViewsStats = getViewsStats;
