import { eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { brands } from '../schemas';

export const getAllBrands = async () => {
  try {
    return await db.select().from(brands);
  } catch {
    throw new InternalServerError('Can not get brands');
  }
};

export const createBrand = async (name: string) => {
  try {
    const [result] = await db.insert(brands).values({ name }).returning();
    return result;
  } catch {
    throw new InternalServerError('Can not create brand');
  }
};

export const getBrandById = async (id: number) => {
  try {
    const [result] = await db.select().from(brands).where(eq(brands.id, id));
    if (!result) {
      throw new NotFoundError('Brand not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find brand');
  }
};

