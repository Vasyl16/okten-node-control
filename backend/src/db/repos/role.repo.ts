import { eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { roles } from '../schemas';

export const getRoleByName = async (name: string) => {
  try {
    const [result] = await db.select().from(roles).where(eq(roles.name, name));
    if (!result) {
      throw new NotFoundError(`Role with name "${name}" not found`);
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find role');
  }
};

export const getRoleById = async (id: number) => {
  try {
    const [result] = await db.select().from(roles).where(eq(roles.id, id));
    if (!result) {
      throw new NotFoundError(`Role with id "${id}" not found`);
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find role');
  }
};

