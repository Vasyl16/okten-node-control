"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
exports.tokens = (0, pg_core_1.pgTable)('tokens', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    accessToken: (0, pg_core_1.text)('accessToken').notNull(),
    refreshToken: (0, pg_core_1.text)('refreshToken').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_schema_1.users.id, { onDelete: 'cascade' }),
});
