"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const account_type_schema_1 = require("./account-type.schema");
const roles_schema_1 = require("./roles.schema");
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    phone: (0, pg_core_1.varchar)('phone', { length: 20 }),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 100 }),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 100 }),
    roleId: (0, pg_core_1.integer)('role_id')
        .notNull()
        .references(() => roles_schema_1.roles.id, { onDelete: 'restrict' }),
    accountTypeId: (0, pg_core_1.integer)('account_type_id')
        .notNull()
        .references(() => account_type_schema_1.accountTypes.id, { onDelete: 'restrict' }),
    isBanned: (0, pg_core_1.boolean)('is_banned').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
