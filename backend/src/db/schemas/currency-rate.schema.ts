import {
  pgTable,
  serial,
  numeric,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

export const currencyRates = pgTable('currency_rates', {
  id: serial('id').primaryKey(),
  provider: varchar('provider', { length: 50 }).notNull().default('privatbank'),
  // 1 USD = usdToUah UAH
  usdToUah: numeric('usd_to_uah', { precision: 12, scale: 4 }).notNull(),
  // 1 EUR = eurToUah UAH
  eurToUah: numeric('eur_to_uah', { precision: 12, scale: 4 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

