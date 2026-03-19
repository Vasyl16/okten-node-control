"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPresenter = void 0;
class UserPresenter {
    toPublicResponse(entity) {
        return {
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
exports.userPresenter = new UserPresenter();
