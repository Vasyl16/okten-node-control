// src/database/seeds/01-account-types.seed.ts
export const accountTypesSeed = [
  {
    name: 'basic',
    price: '0.00',
    maxListings: 1,
  },
  {
    name: 'premium',
    price: '29.99',
    maxListings: null, // unlimited
  },
];
