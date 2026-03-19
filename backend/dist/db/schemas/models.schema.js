"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const brand_schema_1 = require("./brand.schema");
exports.models = (0, pg_core_1.pgTable)('models', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(),
    brandId: (0, pg_core_1.integer)('brand_id')
        .notNull()
        .references(() => brand_schema_1.brands.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
