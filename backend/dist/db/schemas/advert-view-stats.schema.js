"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advertViewStats = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const advertisement_schema_1 = require("./advertisement.schema");
exports.advertViewStats = (0, pg_core_1.pgTable)('advert_view_stats', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    advertId: (0, pg_core_1.integer)('advert_id')
        .notNull()
        .references(() => advertisement_schema_1.advertisements.id, { onDelete: 'cascade' }),
    day: (0, pg_core_1.timestamp)('day', { withTimezone: true }).notNull(),
    views: (0, pg_core_1.integer)('views').notNull().default(0),
}, (table) => ({
    advertDayUnique: (0, pg_core_1.uniqueIndex)('advert_view_stats_advert_day_idx').on(table.advertId, table.day),
}));
