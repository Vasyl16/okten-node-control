// src/database/seeds/02-roles.seed.ts
export const rolesSeed = [
  {
    name: 'buyer',
    description: 'Can browse and contact sellers',
  },
  {
    name: 'seller',
    description: 'Can create and manage listings',
  },
  {
    name: 'manager',
    description: 'Can moderate content and manage users',
  },
  {
    name: 'admin',
    description: 'Full system access',
  },
];
