import { pgTable, serial, varchar, uuid, timestamp, text } from 'drizzle-orm/pg-core';

import { users } from './user.schema';

export const brandRequests = pgTable('brand_requests', {
  id: serial('id').primaryKey(),
  requestedName: varchar('requested_name', { length: 100 }).notNull(),
  comment: text('comment'),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, rejected

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

