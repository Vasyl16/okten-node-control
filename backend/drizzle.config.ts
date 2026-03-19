import type { Config } from 'drizzle-kit';

import { config } from './src/configs/config';

export default {
  schema: './src/db/schemas/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.db.uri,
  },
} as Config;
