"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regions = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.regions = (0, pg_core_1.pgTable)('regions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 100 }).notNull(), // e.g. "Kyiv", "Lviv", "Odesa"
    slug: (0, pg_core_1.varchar)('slug', { length: 100 }).notNull().unique(), // e.g. "kyiv", "lviv"
});
