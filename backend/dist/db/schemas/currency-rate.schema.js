"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currencyRates = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.currencyRates = (0, pg_core_1.pgTable)('currency_rates', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    provider: (0, pg_core_1.varchar)('provider', { length: 50 }).notNull().default('privatbank'),
    // 1 USD = usdToUah UAH
    usdToUah: (0, pg_core_1.numeric)('usd_to_uah', { precision: 12, scale: 4 }).notNull(),
    // 1 EUR = eurToUah UAH
    eurToUah: (0, pg_core_1.numeric)('eur_to_uah', { precision: 12, scale: 4 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});
