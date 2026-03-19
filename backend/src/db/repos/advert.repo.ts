import { and, avg, count, desc, eq, inArray } from 'drizzle-orm';

import { InternalServerError, NotFoundError } from '../../errors/errors';
import { db } from '../drizzle';
import { advertisements } from '../schemas';

export const createAdvert = async (dto: typeof advertisements.$inferInsert) => {
  try {
    const [result] = await db.insert(advertisements).values(dto).returning();
    return result;
  } catch (error) {
    const message =
      error instanceof Error && 'cause' in error
        ? String((error as { cause?: unknown }).cause ?? error.message)
        : String(error);
    console.error('Advert insert error:', message);
    throw new InternalServerError('Can not create advertisement');
  }
};

export const updateAdvertById = async (
  id: number,
  dto: Partial<typeof advertisements.$inferInsert>,
) => {
  try {
    const [result] = await db
      .update(advertisements)
      .set(dto)
      .where(eq(advertisements.id, id))
      .returning();
    if (!result) {
      throw new NotFoundError('Advertisement not found');
    }
    return result;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    const message =
      error instanceof Error && 'cause' in error
        ? String((error as { cause?: unknown }).cause ?? error.message)
        : String(error);
    console.error('Advert update error:', message);
    throw new InternalServerError('Can not update advertisement');
  }
};

export const deleteAdvertById = async (id: number) => {
  try {
    await db.delete(advertisements).where(eq(advertisements.id, id));
  } catch {
    throw new InternalServerError('Can not delete advertisement');
  }
};

export const getAdvertById = async (id: number) => {
  try {
    const [result] = await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.id, id));
    if (!result) {
      throw new NotFoundError('Advertisement not found');
    }
    return result;
  } catch (error) {
    // Surface "not found" to the API layer instead of hiding behind 500
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new NotFoundError('Advertisement not found');
  }
};

export const listAdverts = async () => {
  try {
    return await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.status, 'active'))
      .orderBy(desc(advertisements.createdAt));
  } catch {
    throw new InternalServerError('Can not get advertisements');
  }
};

export const listAdvertsByUserId = async (userId: string) => {
  try {
    return await db
      .select()
      .from(advertisements)
      .where(eq(advertisements.userId, userId))
      .orderBy(desc(advertisements.createdAt));
  } catch {
    throw new InternalServerError('Can not get advertisements');
  }
};

export const listAdvertsByStatuses = async (statuses: string[]) => {
  try {
    return await db
      .select()
      .from(advertisements)
      .where(inArray(advertisements.status, statuses))
      .orderBy(desc(advertisements.updatedAt));
  } catch {
    throw new InternalServerError('Can not get advertisements');
  }
};

export const listAllAdvertsForPriceRecalc = async () => {
  try {
    return await db
      .select({
        id: advertisements.id,
        priceOriginal: advertisements.priceOriginal,
        currencyOriginal: advertisements.currencyOriginal,
      })
      .from(advertisements);
  } catch {
    throw new InternalServerError('Can not get advertisements');
  }
};

export const getRegionAveragePriceUah = async (regionId: number) => {
  try {
    const [row] = await db
      .select({
        value: avg(advertisements.priceUah).as('value'),
      })
      .from(advertisements)
      .where(
        and(
          eq(advertisements.regionId, regionId),
          eq(advertisements.status, 'active'),
        ),
      );

    return row?.value !== null && row?.value !== undefined
      ? Number(row.value)
      : 0;
  } catch {
    throw new InternalServerError('Can not calculate region average price');
  }
};

export const countActiveByUserId = async (userId: string) => {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(advertisements)
      .where(
        and(
          eq(advertisements.userId, userId),
          eq(advertisements.status, 'active'),
        ),
      );
    return Number(row?.value ?? 0);
  } catch {
    throw new InternalServerError('Can not count advertisements');
  }
};

/** Count ads that count toward basic-account limit: active, needs_edit, under_review (excludes inactive) */
export const countListingsByUserId = async (userId: string) => {
  try {
    const [row] = await db
      .select({ value: count() })
      .from(advertisements)
      .where(
        and(
          eq(advertisements.userId, userId),
          inArray(advertisements.status, ['active', 'needs_edit', 'under_review']),
        ),
      );
    return Number(row?.value ?? 0);
  } catch {
    throw new InternalServerError('Can not count advertisements');
  }
};
