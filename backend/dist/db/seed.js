"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
// === SEED DATA ===
const db_1 = require("../constants/db");
// === DB CONNECTION ===
const drizzle_1 = require("./drizzle");
// === SCHEMAS ===
const schemas_1 = require("./schemas");
async function seed() {
    console.log('🌱 Starting database seed...');
    // 1️⃣ Clear dependent tables in a safe order
    await drizzle_1.db.delete(schemas_1.advertisements);
    await drizzle_1.db.delete(schemas_1.tokens);
    await drizzle_1.db.delete(schemas_1.users);
    await drizzle_1.db.delete(schemas_1.rolePermissions);
    await drizzle_1.db.delete(schemas_1.permissions);
    await drizzle_1.db.delete(schemas_1.roles);
    await drizzle_1.db.delete(schemas_1.accountTypes);
    await drizzle_1.db.delete(schemas_1.models);
    await drizzle_1.db.delete(schemas_1.brands);
    await drizzle_1.db.delete(schemas_1.regions);
    await drizzle_1.db.delete(schemas_1.currencyRates);
    // 2️⃣ Account types
    const insertedAccountTypes = await drizzle_1.db
        .insert(schemas_1.accountTypes)
        .values(db_1.accountTypesSeed)
        .returning();
    console.log('✅ account_types seeded');
    // 3️⃣ Roles
    const insertedRoles = await drizzle_1.db.insert(schemas_1.roles).values(db_1.rolesSeed).returning();
    console.log('✅ roles seeded');
    // 4️⃣ Permissions
    const insertedPermissions = await drizzle_1.db
        .insert(schemas_1.permissions)
        .values(db_1.permissionsSeed)
        .returning();
    console.log('✅ permissions seeded');
    // 5️⃣ Role-Permissions mapping
    for (const [roleName, permissionNames] of Object.entries(db_1.rolePermissionsSeed)) {
        const role = insertedRoles.find((r) => r.name === roleName);
        if (!role)
            continue;
        const permissionRows = insertedPermissions.filter((p) => permissionNames.includes(p.name));
        const mappings = permissionRows.map((p) => ({
            roleId: role.id,
            permissionId: p.id,
        }));
        if (mappings.length)
            await drizzle_1.db.insert(schemas_1.rolePermissions).values(mappings);
    }
    console.log('✅ role_permissions seeded');
    // 6️⃣ Admin user
    const adminRole = insertedRoles.find((r) => r.name === 'admin');
    const basicType = insertedAccountTypes.find((t) => t.name === 'basic');
    if (adminRole && basicType) {
        const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
        await drizzle_1.db.insert(schemas_1.users).values({
            email: 'admin@autoria.local',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            roleId: adminRole.id,
            accountTypeId: basicType.id,
            phone: '+380000000000',
        });
        console.log('✅ admin user seeded (email: admin@autoria.local, password: admin123)');
    }
    // 7️⃣ Brands, Models, Regions
    const insertedBrands = await drizzle_1.db
        .insert(schemas_1.brands)
        .values([
        { name: 'BMW' },
        { name: 'Daewoo' },
        { name: 'Toyota' },
        { name: 'Volkswagen' },
    ])
        .returning();
    const bmw = insertedBrands.find((b) => b.name === 'BMW');
    const daewoo = insertedBrands.find((b) => b.name === 'Daewoo');
    const toyota = insertedBrands.find((b) => b.name === 'Toyota');
    const vw = insertedBrands.find((b) => b.name === 'Volkswagen');
    await drizzle_1.db.insert(schemas_1.models).values([
        { name: 'X5', brandId: bmw.id },
        { name: 'X3', brandId: bmw.id },
        { name: 'Lanos', brandId: daewoo.id },
        { name: 'Sens', brandId: daewoo.id },
        { name: 'Camry', brandId: toyota.id },
        { name: 'Corolla', brandId: toyota.id },
        { name: 'Golf', brandId: vw.id },
        { name: 'Passat', brandId: vw.id },
    ]);
    await drizzle_1.db.insert(schemas_1.regions).values([
        { name: 'Kyiv', slug: 'kyiv' },
        { name: 'Lvivska oblast', slug: 'lvivska-oblast' },
        { name: 'Odeska oblast', slug: 'odeska-oblast' },
        { name: 'Kharkivska oblast', slug: 'kharkivska-oblast' },
    ]);
    console.log('✅ brands, models, regions seeded');
    // 8️⃣ Currency rates (initial mock)
    await drizzle_1.db.insert(schemas_1.currencyRates).values({
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
