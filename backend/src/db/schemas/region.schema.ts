import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const regions = pgTable('regions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(), // e.g. "Kyiv", "Lviv", "Odesa"
  slug: varchar('slug', { length: 100 }).notNull().unique(), // e.g. "kyiv", "lviv"
});
