import { desc, eq } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { currencyRates } from '../schemas';

export const getLatestRate = async () => {
  try {
    const [result] = await db
      .select()
      .from(currencyRates)
      .orderBy(desc(currencyRates.createdAt))
      .limit(1);
    if (!result) {
      throw new NotFoundError('Currency rates not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new InternalServerError('Can not get currency rates');
  }
};

export const savePrivatRate = async (params: {
  usdToUah: string;
  eurToUah: string;
}) => {
  try {
    // First try to update existing privatbank row
    const [updated] = await db
      .update(currencyRates)
      .set({
        usdToUah: params.usdToUah,
        eurToUah: params.eurToUah,
        createdAt: new Date(),
      })
      .where(eq(currencyRates.provider, 'privatbank'))
      .returning();

    if (updated) {
      return updated;
    }

    // If nothing to update (no row yet), insert one
    const [inserted] = await db
      .insert(currencyRates)
      .values({
        provider: 'privatbank',
        usdToUah: params.usdToUah,
        eurToUah: params.eurToUah,
      })
      .returning();

    return inserted;
  } catch {
    throw new InternalServerError('Can not save currency rate');
  }
};

