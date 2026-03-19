"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.isUserEmailExist = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const isUserEmailExist = async (email) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(schemas_1.users)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.email, email));
        return result;
    }
    catch (error) {
        console.error(error);
        throw new errors_1.InternalServerError('Can not find user');
    }
};
exports.isUserEmailExist = isUserEmailExist;
const createUser = async (dto) => {
    try {
        const [result] = await drizzle_1.db.insert(schemas_1.users).values(dto).returning();
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find user');
    }
};
exports.createUser = createUser;
