/* eslint-disable no-console */
import { faker } from '@faker-js/faker';

import { db } from './drizzle';
import { advertisements, advertViewStats, models, regions } from './schemas';

const parseUserIds = (): string[] => {
  const arg = process.argv[2];
  if (!arg) return [];
  return arg.split(',').map((s) => s.trim());
};

async function seedExtraAds() {
  const userIds = parseUserIds();
  if (!userIds.length) {
    console.error(
      'Pass comma-separated userIds as first arg, e.g. tsx src/db/seed-extra-ads.ts <id1,id2>',
    );
    process.exit(1);
  }

  const [allModels, allRegions] = await Promise.all([
    db.select().from(models),
    db.select().from(regions),
  ]);

  if (!allModels.length || !allRegions.length) {
    throw new Error('Models or regions are empty, run main seed first');
  }

  const now = new Date();
  const advertsToInsert: (typeof advertisements.$inferInsert)[] = [];

  for (const userId of userIds) {
    for (let i = 0; i < 3; i += 1) {
      const model = faker.helpers.arrayElement(allModels);
      const region = faker.helpers.arrayElement(allRegions);
      const priceUah = faker.number.int({ min: 5000, max: 500000 });

      advertsToInsert.push({
        title: faker.vehicle.vehicle(),
        description: faker.lorem.sentence(),
        priceOriginal: String(priceUah),
        currencyOriginal: 'UAH',
        priceUsd: '0',
        priceEur: '0',
        priceUah: String(priceUah),
        modelId: model.id,
        userId,
        regionId: region.id,
        status: 'active',
        editAttempts: 0,
        moderationComment: null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  const inserted = await db
    .insert(advertisements)
    .values(advertsToInsert)
    .returning();

  console.log(`Inserted ${inserted.length} extra adverts`);

  // Simple fake stats: random views over last 10 days
  const statsInserts: (typeof advertViewStats.$inferInsert)[] = [];
  const msPerDay = 24 * 60 * 60 * 1000;

  for (const ad of inserted) {
    for (let offset = 0; offset < 10; offset += 1) {
      const day = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
          offset * msPerDay,
      );
      statsInserts.push({
        advertId: ad.id,
        day,
        views: faker.number.int({ min: 0, max: 20 }),
      });
    }
  }

  await db.insert(advertViewStats).values(statsInserts);
  console.log('Inserted view stats for extra adverts');
}

seedExtraAds().catch((err) => {
  console.error('❌ seed-extra-ads failed:', err);
  process.exit(1);
});
