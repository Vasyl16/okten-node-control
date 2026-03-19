import {
  pgTable,
  serial,
  integer,
  uuid,
  varchar,
  numeric,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { models } from './models.schema';
import { regions } from './region.schema';
import { users } from './user.schema';

export const advertisements = pgTable('advertisements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 2000 }),

  priceOriginal: numeric('price_original', {
    precision: 12,
    scale: 2,
  }).notNull(),
  currencyOriginal: varchar('currency_original', { length: 3 }).notNull(), // 'UAH', 'USD', 'EUR'

  // converted prices
  priceUsd: numeric('price_usd', { precision: 12, scale: 2 }).notNull(),
  priceEur: numeric('price_eur', { precision: 12, scale: 2 }).notNull(),
  priceUah: numeric('price_uah', { precision: 12, scale: 2 }).notNull(),

  modelId: integer('model_id')
    .notNull()
    .references(() => models.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  regionId: integer('region_id')
    .notNull()
    .references(() => regions.id),

  status: varchar('status', { length: 20 }).notNull().default('active'), // active, needs_edit, inactive, under_review
  editAttempts: integer('edit_attempts').notNull().default(0),
  moderationComment: text('moderation_comment'), // set by manager on approve/reject

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
