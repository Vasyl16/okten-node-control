import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from './user.schema';

export const tokens = pgTable('tokens', {
  id: serial('id').primaryKey(),
  accessToken: text('accessToken').notNull(),
  refreshToken: text('refreshToken').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});
