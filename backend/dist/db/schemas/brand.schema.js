"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brands = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.brands = (0, pg_core_1.pgTable)('brands', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull().unique(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
