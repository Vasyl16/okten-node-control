import {
  pgTable,
  serial,
  varchar,
  timestamp,
  decimal,
  integer,
} from 'drizzle-orm/pg-core';

export const accountTypes = pgTable('account_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(), // 'basic', 'premium'
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull().default('0'),
  maxListings: integer('max_listings'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
