// src/database/seeds/03-permissions.seed.ts
export const permissionsSeed = [
  // Listings
  { name: 'listings.create', description: 'Create new listings' },
  { name: 'listings.read', description: 'View listings' },
  { name: 'listings.update.own', description: 'Update own listings' },
  { name: 'listings.update.any', description: 'Update any listing' },
  { name: 'listings.delete.own', description: 'Delete own listings' },
  { name: 'listings.delete.any', description: 'Delete any listing' },

  // Statistics (Premium)
  { name: 'statistics.view.own', description: 'View own listing statistics' },

  // Users
  { name: 'users.read', description: 'View user profiles' },
  { name: 'users.update.own', description: 'Update own profile' },
  { name: 'users.update.any', description: 'Update any user' },
  { name: 'users.ban', description: 'Ban users' },

  // Moderation
  { name: 'moderation.review', description: 'Review flagged listings' },
  { name: 'moderation.approve', description: 'Approve listings' },
  { name: 'moderation.reject', description: 'Reject listings' },

  // Admin
  { name: 'admin.manage_roles', description: 'Manage roles and permissions' },
  { name: 'admin.manage_brands', description: 'Manage car brands/models' },
];

const adminPermissions = [
  { name: 'admin.manage_roles', description: 'Manage roles and permissions' },
  { name: 'admin.manage_brands', description: 'Manage car brands/models' },
];
