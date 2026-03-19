"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTokenPairByRefreshToken = exports.findTokenPairByAccessToken = exports.deleteTokenPairByRefreshToken = exports.deleteTokenPairByAccessToken = exports.createToken = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const token_schema_1 = require("../schemas/token.schema");
const createToken = async (dto) => {
    try {
        return await drizzle_1.db.insert(token_schema_1.tokens).values(dto).returning();
    }
    catch (error) {
        throw new errors_1.InternalServerError('Failed to create user');
    }
};
exports.createToken = createToken;
const deleteTokenPairByAccessToken = async (accessToken) => {
    try {
        await drizzle_1.db.delete(token_schema_1.tokens).where((0, drizzle_orm_1.eq)(token_schema_1.tokens.accessToken, accessToken));
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not delete tokens');
    }
};
exports.deleteTokenPairByAccessToken = deleteTokenPairByAccessToken;
const deleteTokenPairByRefreshToken = async (refreshToken) => {
    try {
        await drizzle_1.db.delete(token_schema_1.tokens).where((0, drizzle_orm_1.eq)(token_schema_1.tokens.refreshToken, refreshToken));
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not delete tokens');
    }
};
exports.deleteTokenPairByRefreshToken = deleteTokenPairByRefreshToken;
const findTokenPairByAccessToken = async (accessToken) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(token_schema_1.tokens)
            .where((0, drizzle_orm_1.eq)(token_schema_1.tokens.accessToken, accessToken));
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find tokens');
    }
};
exports.findTokenPairByAccessToken = findTokenPairByAccessToken;
const findTokenPairByRefreshToken = async (refreshToken) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(token_schema_1.tokens)
            .where((0, drizzle_orm_1.eq)(token_schema_1.tokens.refreshToken, refreshToken));
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find tokens');
    }
};
exports.findTokenPairByRefreshToken = findTokenPairByRefreshToken;
