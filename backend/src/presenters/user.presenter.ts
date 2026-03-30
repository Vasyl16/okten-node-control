import { User, UserRes } from '../types/user.type';

class UserPresenter {
  toPublicResponse(entity: User): UserRes {
    return {
      id: entity.id,
      accountTypeId: entity.accountTypeId,
      createdAt: entity.createdAt,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      phone: entity.phone,
      roleId: entity.roleId,
      updatedAt: entity.updatedAt,
      isBanned: entity.isBanned,
    };
  }
}

export const userPresenter = new UserPresenter();
