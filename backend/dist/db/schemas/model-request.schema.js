"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelRequests = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const brand_schema_1 = require("./brand.schema");
const user_schema_1 = require("./user.schema");
exports.modelRequests = (0, pg_core_1.pgTable)('model_requests', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    requestedName: (0, pg_core_1.varchar)('requested_name', { length: 100 }).notNull(),
    comment: (0, pg_core_1.text)('comment'),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected
    brandId: (0, pg_core_1.integer)('brand_id')
        .notNull()
        .references(() => brand_schema_1.brands.id, { onDelete: 'cascade' }),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_schema_1.users.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
