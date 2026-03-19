"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesSeed = void 0;
// src/database/seeds/02-roles.seed.ts
exports.rolesSeed = [
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
