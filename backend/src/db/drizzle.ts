import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { config } from '../configs/config';

import * as schema from './schemas';

// Параметри підключення з `docker-compose.yml`
const dbConfig = config.db;

// Створюємо пул з'єднань
const pool = new Pool({
  connectionString: dbConfig.uri,
});

// Ініціалізація Drizzle ORM з пулом та схемами
export const db = drizzle(pool, { schema });

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query('select 1');
};
