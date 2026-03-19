import { eq } from 'drizzle-orm';

import { InternalServerError } from '../../errors/errors';
import { CreateToken } from '../../types/token.type';
import { db } from '../drizzle';
import { tokens } from '../schemas/token.schema';

export const createToken = async (dto: CreateToken) => {
  try {
    return await db.insert(tokens).values(dto).returning();
  } catch (error) {
    throw new InternalServerError('Failed to create user');
  }
};

export const deleteTokenPairByAccessToken = async (accessToken: string) => {
  try {
    await db.delete(tokens).where(eq(tokens.accessToken, accessToken));
  } catch (error) {
    throw new InternalServerError('Can not delete tokens');
  }
};

export const deleteTokenPairByRefreshToken = async (refreshToken: string) => {
  try {
    await db.delete(tokens).where(eq(tokens.refreshToken, refreshToken));
  } catch (error) {
    throw new InternalServerError('Can not delete tokens');
  }
};

export const findTokenPairByAccessToken = async (accessToken: string) => {
  try {
    const [result] = await db
      .select()
      .from(tokens)
      .where(eq(tokens.accessToken, accessToken));

    return result;
  } catch (error) {
    throw new InternalServerError('Can not find tokens');
  }
};

export const findTokenPairByRefreshToken = async (refreshToken: string) => {
  try {
    const [result] = await db
      .select()
      .from(tokens)
      .where(eq(tokens.refreshToken, refreshToken));

    return result;
  } catch (error) {
    throw new InternalServerError('Can not find tokens');
  }
};
