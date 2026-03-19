import { and, eq, gte, sum } from 'drizzle-orm';

import { InternalServerError } from '../../errors/errors';
import { db } from '../drizzle';
import { advertViewStats } from '../schemas';

const toDayDate = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

export const incrementView = async (advertId: number, at: Date) => {
  const day = toDayDate(at);

  try {
    const [existing] = await db
      .select()
      .from(advertViewStats)
      .where(
        and(
          eq(advertViewStats.advertId, advertId),
          eq(advertViewStats.day, day),
        ),
      );

    if (existing) {
      const [updated] = await db
        .update(advertViewStats)
        .set({ views: existing.views + 1 })
        .where(eq(advertViewStats.id, existing.id))
        .returning();
      return updated;
    }

    const [inserted] = await db
      .insert(advertViewStats)
      .values({ advertId, day, views: 1 })
      .returning();

    return inserted;
  } catch {
    throw new InternalServerError('Can not update advert view stats');
  }
};

export type AdvertViewsStats = {
  totalViews: number;
  viewsLastDay: number;
  viewsLastWeek: number;
  viewsLastMonth: number;
};

export const getViewsStats = async (
  advertId: number,
  now: Date,
): Promise<AdvertViewsStats> => {
  const today = toDayDate(now);
  const msPerDay = 24 * 60 * 60 * 1000;

  const dayAgo = new Date(today.getTime() - 1 * msPerDay);
  const weekAgo = new Date(today.getTime() - 7 * msPerDay);
  const monthAgo = new Date(today.getTime() - 30 * msPerDay);

  try {
    const [rowTotal] = await db
      .select({ value: sum(advertViewStats.views).as('value') })
      .from(advertViewStats)
      .where(eq(advertViewStats.advertId, advertId));

    const [rowDay] = await db
      .select({ value: sum(advertViewStats.views).as('value') })
      .from(advertViewStats)
      .where(
        and(
          eq(advertViewStats.advertId, advertId),
          gte(advertViewStats.day, dayAgo),
        ),
      );

    const [rowWeek] = await db
      .select({ value: sum(advertViewStats.views).as('value') })
      .from(advertViewStats)
      .where(
        and(
          eq(advertViewStats.advertId, advertId),
          gte(advertViewStats.day, weekAgo),
        ),
      );

    const [rowMonth] = await db
      .select({ value: sum(advertViewStats.views).as('value') })
      .from(advertViewStats)
      .where(
        and(
          eq(advertViewStats.advertId, advertId),
          gte(advertViewStats.day, monthAgo),
        ),
      );

    return {
      totalViews: Number(rowTotal?.value ?? 0),
      viewsLastDay: Number(rowDay?.value ?? 0),
      viewsLastWeek: Number(rowWeek?.value ?? 0),
      viewsLastMonth: Number(rowMonth?.value ?? 0),
    };
  } catch {
    throw new InternalServerError('Can not read advert view stats');
  }
};

