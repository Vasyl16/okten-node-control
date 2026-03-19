import { InferSelectModel } from 'drizzle-orm';

import { tokens } from '../db/schemas/token.schema';

export type Token = InferSelectModel<typeof tokens>;

export type CreateToken = Pick<
  Token,
  'accessToken' | 'refreshToken' | 'userId'
>;

export interface TokenPayload {
  userId: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
