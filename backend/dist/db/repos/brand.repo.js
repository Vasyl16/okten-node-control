"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandById = exports.createBrand = exports.getAllBrands = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getAllBrands = async () => {
    try {
        return await drizzle_1.db.select().from(schemas_1.brands);
    }
    catch {
        throw new errors_1.InternalServerError('Can not get brands');
    }
};
exports.getAllBrands = getAllBrands;
const createBrand = async (name) => {
    try {
        const [result] = await drizzle_1.db.insert(schemas_1.brands).values({ name }).returning();
        return result;
    }
    catch {
        throw new errors_1.InternalServerError('Can not create brand');
    }
};
exports.createBrand = createBrand;
const getBrandById = async (id) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.brands).where((0, drizzle_orm_1.eq)(schemas_1.brands.id, id));
        if (!result) {
            throw new errors_1.NotFoundError('Brand not found');
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find brand');
    }
};
exports.getBrandById = getBrandById;
