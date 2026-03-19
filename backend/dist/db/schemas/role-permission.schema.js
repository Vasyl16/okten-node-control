"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const permission_schema_1 = require("./permission.schema");
const roles_schema_1 = require("./roles.schema");
exports.rolePermissions = (0, pg_core_1.pgTable)('role_permissions', {
    roleId: (0, pg_core_1.integer)('role_id')
        .notNull()
        .references(() => roles_schema_1.roles.id, { onDelete: 'cascade' }),
    permissionId: (0, pg_core_1.integer)('permission_id')
        .notNull()
        .references(() => permission_schema_1.permissions.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
}, (table) => ({
    pk: (0, pg_core_1.primaryKey)({ columns: [table.roleId, table.permissionId] }),
}));
