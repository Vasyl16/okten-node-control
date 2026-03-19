import { InternalServerError } from '../../errors/errors';
import { db } from '../drizzle';
import { modelRequests } from '../schemas';

export const createModelRequest = async (payload: {
  userId: string;
  brandId: number;
  requestedName: string;
  comment?: string;
}) => {
  try {
    const [result] = await db.insert(modelRequests).values(payload).returning();
    return result;
  } catch {
    throw new InternalServerError('Can not create model request');
  }
};

export const getModelRequests = async () => {
  try {
    return await db.select().from(modelRequests);
  } catch {
    throw new InternalServerError('Can not get model requests');
  }
};

