import { eq } from 'drizzle-orm';

import { InternalServerError } from '../../errors/errors';
import type { User } from '../../types/user.type';
import { db } from '../drizzle';
import { users } from '../schemas';

export const isUserEmailExist = async (email: string) => {
  try {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  } catch (error) {
    console.error(error);
    throw new InternalServerError('Can not find user');
  }
};

export const createUser = async (dto: Omit<User, 'id'>) => {
  try {
    const [result] = await db.insert(users).values(dto).returning();
    return result;
  } catch (error) {
    throw new InternalServerError('Can not find user');
  }
};
