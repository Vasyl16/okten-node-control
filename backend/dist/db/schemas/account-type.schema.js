"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTypes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.accountTypes = (0, pg_core_1.pgTable)('account_types', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }).notNull().unique(), // 'basic', 'premium'
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    price: (0, pg_core_1.decimal)('price', { precision: 10, scale: 2 }).notNull().default('0'),
    maxListings: (0, pg_core_1.integer)('max_listings'),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
