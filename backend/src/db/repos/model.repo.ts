import { eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { models } from '../schemas';

export const getModelsByBrandId = async (brandId: number) => {
  try {
    return await db.select().from(models).where(eq(models.brandId, brandId));
  } catch {
    throw new InternalServerError('Can not get models');
  }
};

export const createModel = async (name: string, brandId: number) => {
  try {
    const [result] = await db
      .insert(models)
      .values({ name, brandId })
      .returning({
        id: models.id,
        name: models.name,
        brandId: models.brandId,
        createdAt: models.createdAt,
        updatedAt: models.updatedAt,
      });

    if (!result) {
      throw new InternalServerError('Can not create model');
    }

    return result;
  } catch {
    throw new InternalServerError('Can not create model');
  }
};

export const getModelById = async (id: number) => {
  try {
    const [result] = await db.select().from(models).where(eq(models.id, id));
    if (!result) {
      throw new NotFoundError('Model not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not find model');
  }
};

