import { InferSelectModel } from 'drizzle-orm';

import { users } from '../db/schemas';

import type { TokenPair } from './token.type';

export type User = InferSelectModel<typeof users>;

// DTO for public sign-up: profile + credentials, optional desired role (buyer/seller)
export type SignUpUser = Pick<
  User,
  'email' | 'password' | 'firstName' | 'lastName' | 'phone'
> & {
  role?: 'buyer' | 'seller';
};

export type LoginUser = Pick<User, 'email' | 'password'>;

export type UserResponseWithToken = {
  user: UserRes;
  tokenPair: TokenPair;
};

export type UserRes = Omit<User, 'id' | 'password'>;
