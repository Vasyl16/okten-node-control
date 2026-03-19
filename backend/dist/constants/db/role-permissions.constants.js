"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissionsSeed = void 0;
// src/database/seeds/04-role-permissions.seed.ts
exports.rolePermissionsSeed = {
    buyer: ['listings.read', 'users.update.own'],
    seller: [
        'listings.create',
        'listings.read',
        'listings.update.own',
        'listings.delete.own',
        'users.update.own',
    ],
    manager: [
        'listings.read',
        'listings.update.any',
        'listings.delete.any',
        'users.read',
        'users.ban',
        'moderation.review',
        'moderation.approve',
        'moderation.reject',
    ],
    admin: [
        // All permissions (insert * or list all)
        'listings.create',
        'listings.read',
        'listings.update.own',
        'listings.update.any',
        'listings.delete.own',
        'listings.delete.any',
        'statistics.view.own',
        'users.read',
        'users.update.own',
        'users.update.any',
        'users.ban',
        'moderation.review',
        'moderation.approve',
        'moderation.reject',
        'admin.manage_roles',
        'admin.manage_brands',
    ],
};
