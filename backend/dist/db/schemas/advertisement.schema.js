"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advertisements = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const models_schema_1 = require("./models.schema");
const region_schema_1 = require("./region.schema");
const user_schema_1 = require("./user.schema");
exports.advertisements = (0, pg_core_1.pgTable)('advertisements', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.varchar)('title', { length: 255 }).notNull(),
    description: (0, pg_core_1.varchar)('description', { length: 2000 }),
    priceOriginal: (0, pg_core_1.numeric)('price_original', {
        precision: 12,
        scale: 2,
    }).notNull(),
    currencyOriginal: (0, pg_core_1.varchar)('currency_original', { length: 3 }).notNull(), // 'UAH', 'USD', 'EUR'
    // converted prices
    priceUsd: (0, pg_core_1.numeric)('price_usd', { precision: 12, scale: 2 }).notNull(),
    priceEur: (0, pg_core_1.numeric)('price_eur', { precision: 12, scale: 2 }).notNull(),
    priceUah: (0, pg_core_1.numeric)('price_uah', { precision: 12, scale: 2 }).notNull(),
    modelId: (0, pg_core_1.integer)('model_id')
        .notNull()
        .references(() => models_schema_1.models.id),
    userId: (0, pg_core_1.uuid)('user_id')
        .notNull()
        .references(() => user_schema_1.users.id, { onDelete: 'cascade' }),
    regionId: (0, pg_core_1.integer)('region_id')
        .notNull()
        .references(() => region_schema_1.regions.id),
    status: (0, pg_core_1.varchar)('status', { length: 20 }).notNull().default('active'), // active, needs_edit, inactive, under_review
    editAttempts: (0, pg_core_1.integer)('edit_attempts').notNull().default(0),
    moderationComment: (0, pg_core_1.text)('moderation_comment'), // set by manager on approve/reject
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
