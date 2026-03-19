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
exports.authService = void 0;
const accountTypeRepo = __importStar(require("../db/repos/account-type.repo"));
const authRepo = __importStar(require("../db/repos/auth.repo"));
const roleRepo = __importStar(require("../db/repos/role.repo"));
const tokenRepo = __importStar(require("../db/repos/token.repo"));
const userRepo = __importStar(require("../db/repos/user.repo"));
const errors_1 = require("../errors/errors");
const user_presenter_1 = require("../presenters/user.presenter");
// import { BadRequestError } from '../errors/errors';
// import { authRepo } from '../repos/auth.repo';
// import { tokenRepo } from '../repos/tokenRepo';
// import { userRepo } from '../repos/user.repo';
// import { TokenPayload } from '../types/token.type';
// import {
//   LoginUser,
//   SignUpUser,
//   UserResponseWithToken,
// } from '../types/user.type';
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
class AuthService {
    async signUpUser(dto) {
        const { email, password } = dto;
        const isUserExist = await authRepo.isUserEmailExist(email);
        if (isUserExist) {
            throw new errors_1.BadRequestError('The user with given email already exist');
        }
        const roleName = dto.role ?? 'seller';
        if (roleName !== 'buyer' && roleName !== 'seller') {
            throw new errors_1.BadRequestError('role must be either buyer or seller');
        }
        const selectedRole = await roleRepo.getRoleByName(roleName);
        const basicAccountType = await accountTypeRepo.getAccountTypeByName('basic');
        const hashedPassword = await password_service_1.passwordService.hashPassword(password);
        const user = await authRepo.createUser({
            email,
            password: hashedPassword,
            firstName: dto.firstName ?? null,
            lastName: dto.lastName ?? null,
            phone: dto.phone ?? null,
            roleId: selectedRole.id,
            accountTypeId: basicAccountType.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isBanned: false,
        });
        const tokenPair = token_service_1.tokenService.generateToken({
            userId: user.id,
        });
        await tokenRepo.createToken({ ...tokenPair, userId: user.id });
        return { user: user_presenter_1.userPresenter.toPublicResponse(user), tokenPair };
    }
    async createManager(dto) {
        const { email, password } = dto;
        const isUserExist = await authRepo.isUserEmailExist(email);
        if (isUserExist) {
            throw new errors_1.BadRequestError('The user with given email already exist');
        }
        const managerRole = await roleRepo.getRoleByName('manager');
        const basicAccountType = await accountTypeRepo.getAccountTypeByName('basic');
        const hashedPassword = await password_service_1.passwordService.hashPassword(password);
        const user = await authRepo.createUser({
            email,
            password: hashedPassword,
            firstName: dto.firstName ?? null,
            lastName: dto.lastName ?? null,
            phone: dto.phone ?? null,
            roleId: managerRole.id,
            accountTypeId: basicAccountType.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isBanned: false,
        });
        const tokenPair = token_service_1.tokenService.generateToken({
            userId: user.id,
        });
        await tokenRepo.createToken({ ...tokenPair, userId: user.id });
        return { user: user_presenter_1.userPresenter.toPublicResponse(user), tokenPair };
    }
    async singInUser(dto) {
        const user = await userRepo.getByEmail(dto.email);
        if (!user) {
            throw new errors_1.BadRequestError('Invalid credentials');
        }
        const isPasswordCorrect = await password_service_1.passwordService.comparePassword(dto.password, user.password);
        if (!isPasswordCorrect) {
            throw new errors_1.BadRequestError('Invalid credentials');
        }
        if (user.isBanned) {
            throw new errors_1.BadRequestError('User is banned');
        }
        const tokenPair = token_service_1.tokenService.generateToken({
            userId: user.id,
        });
        await tokenRepo.createToken({ ...tokenPair, userId: user.id });
        return { user: user_presenter_1.userPresenter.toPublicResponse(user), tokenPair };
    }
    async logOutUser(accessToken) {
        await tokenRepo.deleteTokenPairByAccessToken(accessToken);
    }
    async refresToken(tokenPayload, refreshToken) {
        const { userId } = tokenPayload;
        await tokenRepo.deleteTokenPairByRefreshToken(refreshToken);
        const tokenPair = token_service_1.tokenService.generateToken({ userId });
        await tokenRepo.createToken({ ...tokenPair, userId });
        return tokenPair;
    }
}
exports.authService = new AuthService();
