import { eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { accountTypes } from '../schemas';

export const getAccountTypeByName = async (name: string) => {
  try {
    const [result] = await db
      .select()
      .from(accountTypes)
      .where(eq(accountTypes.name, name));
    if (!result) {
      throw new NotFoundError(`Account type with name "${name}" not found`);
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find account type');
  }
};

