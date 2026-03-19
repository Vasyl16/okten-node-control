/* eslint-disable no-console */
import 'dotenv/config';
import bcrypt from 'bcrypt';

// === SEED DATA ===
import {
  accountTypesSeed,
  permissionsSeed,
  rolePermissionsSeed,
  rolesSeed,
} from '../constants/db';

// === DB CONNECTION ===
import { db } from './drizzle';
// === SCHEMAS ===
import {
  accountTypes,
  advertisements,
  brands,
  currencyRates,
  models,
  permissions,
  regions,
  rolePermissions,
  roles,
  tokens,
  users,
} from './schemas';

async function seed() {
  console.log('🌱 Starting database seed...');
  // 1️⃣ Clear dependent tables in a safe order
  await db.delete(advertisements);
  await db.delete(tokens);
  await db.delete(users);
  await db.delete(rolePermissions);
  await db.delete(permissions);
  await db.delete(roles);
  await db.delete(accountTypes);
  await db.delete(models);
  await db.delete(brands);
  await db.delete(regions);
  await db.delete(currencyRates);

  // 2️⃣ Account types
  const insertedAccountTypes = await db
    .insert(accountTypes)
    .values(accountTypesSeed)
    .returning();
  console.log('✅ account_types seeded');

  // 3️⃣ Roles
  const insertedRoles = await db.insert(roles).values(rolesSeed).returning();
  console.log('✅ roles seeded');

  // 4️⃣ Permissions
  const insertedPermissions = await db
    .insert(permissions)
    .values(permissionsSeed)
    .returning();
  console.log('✅ permissions seeded');

  // 5️⃣ Role-Permissions mapping
  for (const [roleName, permissionNames] of Object.entries(
    rolePermissionsSeed,
  )) {
    const role = insertedRoles.find((r) => r.name === roleName);
    if (!role) continue;

    const permissionRows = insertedPermissions.filter((p) =>
      permissionNames.includes(p.name),
    );

    const mappings = permissionRows.map((p) => ({
      roleId: role.id,
      permissionId: p.id,
    }));

    if (mappings.length) await db.insert(rolePermissions).values(mappings);
  }
  console.log('✅ role_permissions seeded');

  // 6️⃣ Admin user
  const adminRole = insertedRoles.find((r) => r.name === 'admin');
  const basicType = insertedAccountTypes.find((t) => t.name === 'basic');

  if (adminRole && basicType) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.insert(users).values({
      email: 'admin@autoria.local',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: adminRole.id,
      accountTypeId: basicType.id,
      phone: '+380000000000',
    });
    console.log(
      '✅ admin user seeded (email: admin@autoria.local, password: admin123)',
    );
  }

  // 7️⃣ Brands, Models, Regions
  const insertedBrands = await db
    .insert(brands)
    .values([
      { name: 'BMW' },
      { name: 'Daewoo' },
      { name: 'Toyota' },
      { name: 'Volkswagen' },
    ])
    .returning();

  const bmw = insertedBrands.find((b) => b.name === 'BMW')!;
  const daewoo = insertedBrands.find((b) => b.name === 'Daewoo')!;
  const toyota = insertedBrands.find((b) => b.name === 'Toyota')!;
  const vw = insertedBrands.find((b) => b.name === 'Volkswagen')!;

  await db.insert(models).values([
    { name: 'X5', brandId: bmw.id },
    { name: 'X3', brandId: bmw.id },
    { name: 'Lanos', brandId: daewoo.id },
    { name: 'Sens', brandId: daewoo.id },
    { name: 'Camry', brandId: toyota.id },
    { name: 'Corolla', brandId: toyota.id },
    { name: 'Golf', brandId: vw.id },
    { name: 'Passat', brandId: vw.id },
  ]);

  await db.insert(regions).values([
    { name: 'Kyiv', slug: 'kyiv' },
    { name: 'Lvivska oblast', slug: 'lvivska-oblast' },
    { name: 'Odeska oblast', slug: 'odeska-oblast' },
    { name: 'Kharkivska oblast', slug: 'kharkivska-oblast' },
  ]);
  console.log('✅ brands, models, regions seeded');

  // 8️⃣ Currency rates (initial mock)
  await db.insert(currencyRates).values({
    provider: 'privatbank',
    usdToUah: '40.0',
    eurToUah: '42.0',
  });
  console.log('✅ currency_rates seeded');

  console.log('🎉 All seeding completed!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
