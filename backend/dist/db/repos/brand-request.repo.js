"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrandRequests = exports.createBrandRequest = void 0;
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const createBrandRequest = async (payload) => {
    try {
        const [result] = await drizzle_1.db.insert(schemas_1.brandRequests).values(payload).returning();
        return result;
    }
    catch {
        throw new errors_1.InternalServerError('Can not create brand request');
    }
};
exports.createBrandRequest = createBrandRequest;
const getBrandRequests = async () => {
    try {
        return await drizzle_1.db.select().from(schemas_1.brandRequests);
    }
    catch {
        throw new errors_1.InternalServerError('Can not get brand requests');
    }
};
exports.getBrandRequests = getBrandRequests;
