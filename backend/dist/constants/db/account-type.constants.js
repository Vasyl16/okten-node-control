"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountTypesSeed = void 0;
// src/database/seeds/01-account-types.seed.ts
exports.accountTypesSeed = [
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
