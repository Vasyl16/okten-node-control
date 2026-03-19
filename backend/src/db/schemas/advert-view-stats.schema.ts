import { integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { advertisements } from './advertisement.schema';

export const advertViewStats = pgTable(
  'advert_view_stats',
  {
    id: serial('id').primaryKey(),
    advertId: integer('advert_id')
      .notNull()
      .references(() => advertisements.id, { onDelete: 'cascade' }),
    day: timestamp('day', { withTimezone: true }).notNull(),
    views: integer('views').notNull().default(0),
  },
  (table) => ({
    advertDayUnique: uniqueIndex('advert_view_stats_advert_day_idx').on(
      table.advertId,
      table.day,
    ),
  }),
);

