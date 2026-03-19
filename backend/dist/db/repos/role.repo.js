"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoleById = exports.getRoleByName = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getRoleByName = async (name) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.roles).where((0, drizzle_orm_1.eq)(schemas_1.roles.name, name));
        if (!result) {
            throw new errors_1.NotFoundError(`Role with name "${name}" not found`);
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find role');
    }
};
exports.getRoleByName = getRoleByName;
const getRoleById = async (id) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.roles).where((0, drizzle_orm_1.eq)(schemas_1.roles.id, id));
        if (!result) {
            throw new errors_1.NotFoundError(`Role with id "${id}" not found`);
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find role');
    }
};
exports.getRoleById = getRoleById;
