"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionById = exports.getAllRegions = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getAllRegions = async () => {
    try {
        return await drizzle_1.db.select().from(schemas_1.regions);
    }
    catch {
        throw new errors_1.InternalServerError('Can not get regions');
    }
};
exports.getAllRegions = getAllRegions;
const getRegionById = async (id) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.regions).where((0, drizzle_orm_1.eq)(schemas_1.regions.id, id));
        if (!result) {
            throw new errors_1.NotFoundError('Region not found');
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find region');
    }
};
exports.getRegionById = getRegionById;
