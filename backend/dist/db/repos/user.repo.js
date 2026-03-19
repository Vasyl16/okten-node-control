"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullUserById = exports.updateById = exports.getAll = exports.getById = exports.getByEmail = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const errors_1 = require("../../errors/errors");
const drizzle_1 = require("../drizzle");
const schemas_1 = require("../schemas");
const getByEmail = async (email) => {
    try {
        const [result] = await drizzle_1.db
            .select()
            .from(schemas_1.users)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.email, email));
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find user');
    }
};
exports.getByEmail = getByEmail;
const getById = async (id) => {
    try {
        const [result] = await drizzle_1.db.select().from(schemas_1.users).where((0, drizzle_orm_1.eq)(schemas_1.users.id, id));
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find user');
    }
};
exports.getById = getById;
const getAll = async () => {
    try {
        const result = await drizzle_1.db.select().from(schemas_1.users);
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not get users');
    }
};
exports.getAll = getAll;
const updateById = async (id, payload) => {
    try {
        const [result] = await drizzle_1.db
            .update(schemas_1.users)
            .set(payload)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.id, id))
            .returning();
        return result;
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not update user');
    }
};
exports.updateById = updateById;
const getFullUserById = async (id) => {
    try {
        const [user] = await drizzle_1.db
            .select({
            id: schemas_1.users.id,
            email: schemas_1.users.email,
            password: schemas_1.users.password,
            phone: schemas_1.users.phone,
            firstName: schemas_1.users.firstName,
            lastName: schemas_1.users.lastName,
            roleId: schemas_1.users.roleId,
        })
            .from(schemas_1.users)
            .where((0, drizzle_orm_1.eq)(schemas_1.users.id, id))
            .leftJoin(schemas_1.roles, (0, drizzle_orm_1.eq)(schemas_1.users.roleId, schemas_1.roles.id))
            .leftJoin(schemas_1.accountTypes, (0, drizzle_orm_1.eq)(schemas_1.users.accountTypeId, schemas_1.accountTypes.id));
        if (!user) {
            return undefined;
        }
        const userPermissions = await drizzle_1.db
            .select({
            name: schemas_1.permissions.name,
        })
            .from(schemas_1.roles)
            .innerJoin(schemas_1.rolePermissions, (0, drizzle_orm_1.eq)(schemas_1.roles.id, schemas_1.rolePermissions.roleId))
            .innerJoin(schemas_1.permissions, (0, drizzle_orm_1.eq)(schemas_1.rolePermissions.permissionId, schemas_1.permissions.id))
            .where((0, drizzle_orm_1.eq)(schemas_1.roles.id, user.roleId));
        const permissionsList = userPermissions.map((p) => p.name);
        return {
            ...user,
            permissions: permissionsList,
        };
    }
    catch (error) {
        throw new errors_1.InternalServerError('Can not find user');
    }
};
exports.getFullUserById = getFullUserById;
