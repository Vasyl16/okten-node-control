import { eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { regions } from '../schemas';

export const getAllRegions = async () => {
  try {
    return await db.select().from(regions);
  } catch {
    throw new InternalServerError('Can not get regions');
  }
};

export const getRegionById = async (id: number) => {
  try {
    const [result] = await db.select().from(regions).where(eq(regions.id, id));
    if (!result) {
      throw new NotFoundError('Region not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find region');
  }
};

