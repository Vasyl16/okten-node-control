"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const roleRepo = __importStar(require("../db/repos/role.repo"));
const userRepo = __importStar(require("../db/repos/user.repo"));
const errors_1 = require("../errors/errors");
const user_presenter_1 = require("../presenters/user.presenter");
class UserService {
    async getCurrentUser(userId) {
        const user = await userRepo.getById(userId);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user_presenter_1.userPresenter.toPublicResponse(user);
    }
    async updateCurrentUser(userId, payload) {
        const user = await userRepo.updateById(userId, payload);
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return user_presenter_1.userPresenter.toPublicResponse(user);
    }
    async listUsers() {
        const users = await userRepo.getAll();
        return users.map((u) => user_presenter_1.userPresenter.toPublicResponse(u));
    }
    async banUser(callerUserId, targetUserId) {
        const [caller, target] = await Promise.all([
            userRepo.getById(callerUserId),
            userRepo.getById(targetUserId),
        ]);
        if (!target) {
            throw new errors_1.NotFoundError('User not found');
        }
        if (!caller) {
            throw new errors_1.NotFoundError('Current user not found');
        }
        const [adminRole, managerRole, buyerRole, sellerRole] = await Promise.all([
            roleRepo.getRoleByName('admin'),
            roleRepo.getRoleByName('manager'),
            roleRepo.getRoleByName('buyer'),
            roleRepo.getRoleByName('seller'),
        ]);
        // No one can ban admins
        if (target.roleId === adminRole.id) {
            throw new errors_1.BadRequestError('Admin users cannot be banned');
        }
        // Managers can only ban buyers and sellers
        if (caller.roleId === managerRole.id &&
            target.roleId !== buyerRole.id &&
            target.roleId !== sellerRole.id) {
            throw new errors_1.BadRequestError('Managers can only ban buyers and sellers');
        }
        await userRepo.updateById(targetUserId, { isBanned: true });
    }
    async unbanUser(userId) {
        const user = await userRepo.updateById(userId, { isBanned: false });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
    }
}
exports.userService = new UserService();
// import { userRepo } from '../repos/user.repo';
// import { User } from '../types/user.interface';
// class UserService {}
// export const userService = new UserService();
