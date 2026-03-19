import { eq } from 'drizzle-orm';

import { InternalServerError } from '../../errors/errors';
import { db } from '../drizzle';
import { accountTypes, permissions, rolePermissions, roles, users } from '../schemas';

export const getByEmail = async (email: string) => {
  try {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result;
  } catch (error) {
    throw new InternalServerError('Can not find user');
  }
};

export const getById = async (id: string) => {
  try {
    const [result] = await db.select().from(users).where(eq(users.id, id));
    return result;
  } catch (error) {
    throw new InternalServerError('Can not find user');
  }
};

export const getAll = async () => {
  try {
    const result = await db.select().from(users);
    return result;
  } catch (error) {
    throw new InternalServerError('Can not get users');
  }
};

export const updateById = async (
  id: string,
  payload: Partial<{
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    isBanned: boolean;
  }>,
) => {
  try {
    const [result] = await db
      .update(users)
      .set(payload)
      .where(eq(users.id, id))
      .returning();
    return result;
  } catch (error) {
    throw new InternalServerError('Can not update user');
  }
};

export const getFullUserById = async (id: string) => {
  try {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        phone: users.phone,
        firstName: users.firstName,
        lastName: users.lastName,
        roleId: users.roleId,
      })
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(roles, eq(users.roleId, roles.id))
      .leftJoin(accountTypes, eq(users.accountTypeId, accountTypes.id));

    if (!user) {
      return undefined;
    }

    const userPermissions = await db
      .select({
        name: permissions.name,
      })
      .from(roles)
      .innerJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(eq(roles.id, user.roleId));

    const permissionsList = userPermissions.map((p) => p.name);

    return {
      ...user,
      permissions: permissionsList,
    };
  } catch (error) {
    throw new InternalServerError('Can not find user');
  }
};
