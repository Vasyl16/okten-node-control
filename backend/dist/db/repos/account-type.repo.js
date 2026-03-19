"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountTypeByName = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getAccountTypeByName = async (name) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(schemas_1.accountTypes)
            .where((0, drizzle_orm_1.eq)(schemas_1.accountTypes.name, name));
        if (!result) {
            throw new errors_1.NotFoundError(`Account type with name "${name}" not found`);
        }
        return result;
    }
    catch (error) {
        if (error instanceof errors_1.NotFoundError) {
            throw error;
        }
        throw new errors_1.InternalServerError('Can not find account type');
    }
};
exports.getAccountTypeByName = getAccountTypeByName;
