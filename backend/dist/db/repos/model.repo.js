"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelById = exports.createModel = exports.getModelsByBrandId = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getModelsByBrandId = async (brandId) => {
    try {
        return await drizzle_1.db.select().from(schemas_1.models).where((0, drizzle_orm_1.eq)(schemas_1.models.brandId, brandId));
    }
    catch {
        throw new errors_1.InternalServerError('Can not get models');
    }
};
exports.getModelsByBrandId = getModelsByBrandId;
const createModel = async (name, brandId) => {
    try {
        const [result] = await drizzle_1.db
            .insert(schemas_1.models)
            .values({ name, brandId })
            .returning({
            id: schemas_1.models.id,
            name: schemas_1.models.name,
            brandId: schemas_1.models.brandId,
            createdAt: schemas_1.models.createdAt,
            updatedAt: schemas_1.models.updatedAt,
        });
        if (!result) {
            throw new errors_1.InternalServerError('Can not create model');
        }
        return result;
    }
    catch {
        throw new errors_1.InternalServerError('Can not create model');
    }
};
exports.createModel = createModel;
const getModelById = async (id) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.models).where((0, drizzle_orm_1.eq)(schemas_1.models.id, id));
        if (!result) {
            throw new errors_1.NotFoundError('Model not found');
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find model');
    }
};
exports.getModelById = getModelById;
