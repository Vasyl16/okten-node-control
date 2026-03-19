import { pgTable, serial, varchar, uuid, integer, timestamp, text } from 'drizzle-orm/pg-core';

import { brands } from './brand.schema';
import { users } from './user.schema';

export const modelRequests = pgTable('model_requests', {
  id: serial('id').primaryKey(),
  requestedName: varchar('requested_name', { length: 100 }).notNull(),
  comment: text('comment'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected

  brandId: integer('brand_id')
    .notNull()
    .references(() => brands.id, { onDelete: 'cascade' }),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

