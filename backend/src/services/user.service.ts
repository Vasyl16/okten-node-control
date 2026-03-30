import * as roleRepo from '../db/repos/role.repo';
import * as userRepo from '../db/repos/user.repo';
import { BadRequestError, NotFoundError } from '../errors/errors';
import { userPresenter } from '../presenters/user.presenter';
import type { UserProfileUpdateDto, UserRes } from '../types/user.type';

class UserService {
  async getCurrentUser(userId: string): Promise<UserRes> {
    const user = await userRepo.getById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return userPresenter.toPublicResponse(user);
  }

  async updateCurrentUser(
    userId: string,
    payload: UserProfileUpdateDto,
  ): Promise<UserRes> {
    const existingUser = await userRepo.getById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const user = await userRepo.updateById(userId, payload);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return userPresenter.toPublicResponse(user);
  }

  async listUsers(): Promise<UserRes[]> {
    const users = await userRepo.getAll();
    return users.map((u) => userPresenter.toPublicResponse(u));
  }

  async banUser(callerUserId: string, targetUserId: string): Promise<void> {
    const [caller, target] = await Promise.all([
      userRepo.getById(callerUserId),
      userRepo.getById(targetUserId),
    ]);

    if (!target) {
      throw new NotFoundError('User not found');
    }
    if (!caller) {
      throw new NotFoundError('Current user not found');
    }

    const [adminRole, managerRole, buyerRole, sellerRole] = await Promise.all([
      roleRepo.getRoleByName('admin'),
      roleRepo.getRoleByName('manager'),
      roleRepo.getRoleByName('buyer'),
      roleRepo.getRoleByName('seller'),
    ]);

    // No one can ban admins
    if (target.roleId === adminRole.id) {
      throw new BadRequestError('Admin users cannot be banned');
    }

    // Managers can only ban buyers and sellers
    if (
      caller.roleId === managerRole.id &&
      target.roleId !== buyerRole.id &&
      target.roleId !== sellerRole.id
    ) {
      throw new BadRequestError(
        'Managers can only ban buyers and sellers',
      );
    }

    await userRepo.updateById(targetUserId, { isBanned: true });
  }

  async unbanUser(userId: string): Promise<void> {
    const user = await userRepo.updateById(userId, { isBanned: false });
    if (!user) {
      throw new NotFoundError('User not found');
    }
  }
}

export const userService = new UserService();
// import { userRepo } from '../repos/user.repo';
// import { User } from '../types/user.interface';

// class UserService {}

// export const userService = new UserService();
