"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRequests = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const user_schema_1 = require("./user.schema");
exports.brandRequests = (0, pg_core_1.pgTable)('brand_requests', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    requestedName: (0, pg_core_1.varchar)('requested_name', { length: 100 }).notNull(),
    comment: (0, pg_core_1.text)('comment'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_schema_1.users.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
