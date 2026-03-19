import { InternalServerError } from '../../errors/errors';
import { db } from '../drizzle';
import { brandRequests } from '../schemas';

export const createBrandRequest = async (payload: {
  userId: string;
  requestedName: string;
  comment?: string;
}) => {
  try {
    const [result] = await db.insert(brandRequests).values(payload).returning();
    return result;
  } catch {
    throw new InternalServerError('Can not create brand request');
  }
};

export const getBrandRequests = async () => {
  try {
    return await db.select().from(brandRequests);
  } catch {
    throw new InternalServerError('Can not get brand requests');
  }
};

