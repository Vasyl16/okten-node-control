import * as accountTypeRepo from '../db/repos/account-type.repo';
import * as authRepo from '../db/repos/auth.repo';
import * as roleRepo from '../db/repos/role.repo';
import * as tokenRepo from '../db/repos/token.repo';
import * as userRepo from '../db/repos/user.repo';
import { BadRequestError, ConflictError, ForbiddenError } from '../errors/errors';
import { userPresenter } from '../presenters/user.presenter';
import { TokenPair, TokenPayload } from '../types/token.type';
import {
  LoginUser,
  SignUpUser,
  UserResponseWithToken,
} from '../types/user.type';

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

import { passwordService } from './password.service';
import { tokenService } from './token.service';

class AuthService {
  async signUpUser(dto: SignUpUser): Promise<UserResponseWithToken> {
    const { email, password } = dto;

    const isUserExist = await authRepo.isUserEmailExist(email);

    if (isUserExist) {
      throw new ConflictError('The user with given email already exist');
    }

    const roleName = dto.role ?? 'seller';

    const selectedRole = await roleRepo.getRoleByName(roleName);
    const basicAccountType =
      await accountTypeRepo.getAccountTypeByName('basic');

    const hashedPassword = await passwordService.hashPassword(password);

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

    const tokenPair = tokenService.generateToken({
      userId: user.id,
    });

    await tokenRepo.createToken({ ...tokenPair, userId: user.id });

    return { user: userPresenter.toPublicResponse(user), tokenPair };
  }

  async createManager(dto: SignUpUser): Promise<UserResponseWithToken> {
    const { email, password } = dto;

    const isUserExist = await authRepo.isUserEmailExist(email);

    if (isUserExist) {
      throw new ConflictError('The user with given email already exist');
    }

    const managerRole = await roleRepo.getRoleByName('manager');
    const basicAccountType =
      await accountTypeRepo.getAccountTypeByName('basic');

    const hashedPassword = await passwordService.hashPassword(password);

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

    const tokenPair = tokenService.generateToken({
      userId: user.id,
    });

    await tokenRepo.createToken({ ...tokenPair, userId: user.id });

    return { user: userPresenter.toPublicResponse(user), tokenPair };
  }

  async signInUser(dto: LoginUser): Promise<UserResponseWithToken> {
    const user = await userRepo.getByEmail(dto.email);

    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid credentials');
    }

    if (user.isBanned) {
      throw new ForbiddenError('User is banned');
    }

    const tokenPair = tokenService.generateToken({
      userId: user.id,
    });

    await tokenRepo.createToken({ ...tokenPair, userId: user.id });

    return { user: userPresenter.toPublicResponse(user), tokenPair };
  }

  async logOutUser(accessToken: string): Promise<void> {
    await tokenRepo.deleteTokenPairByAccessToken(accessToken);
  }

  async refresToken(
    tokenPayload: TokenPayload,
    refreshToken: string,
  ): Promise<TokenPair> {
    const { userId } = tokenPayload;

    await tokenRepo.deleteTokenPairByRefreshToken(refreshToken);

    const tokenPair = tokenService.generateToken({ userId });

    await tokenRepo.createToken({ ...tokenPair, userId });

    return tokenPair;
  }
}

export const authService = new AuthService();
