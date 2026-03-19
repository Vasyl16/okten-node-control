"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelRequests = exports.createModelRequest = void 0;
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const createModelRequest = async (payload) => {
    try {
        const [result] = await drizzle_1.db.insert(schemas_1.modelRequests).values(payload).returning();
        return result;
    }
    catch {
        throw new errors_1.InternalServerError('Can not create model request');
    }
};
exports.createModelRequest = createModelRequest;
const getModelRequests = async () => {
    try {
        return await drizzle_1.db.select().from(schemas_1.modelRequests);
    }
    catch {
        throw new errors_1.InternalServerError('Can not get model requests');
    }
};
exports.getModelRequests = getModelRequests;
