import { NextFunction, Request, Response } from 'express';

import { authService } from '../services/auth.service';
import { TokenPayload } from '../types/token.type';
import { LoginUser, SignUpUser } from '../types/user.type';

class AuthController {
  async signUpUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as SignUpUser;
      const newUserData = await authService.signUpUser(dto);
      res.status(201).send(newUserData);
    } catch (error) {
      next(error);
    }
  }

  async signInUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as LoginUser;
      const userInfo = await authService.signInUser(dto);

      res.status(200).send(userInfo);
    } catch (error) {
      next(error);
    }
  }

  async createManager(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const dto = req.body as SignUpUser;
      const newUserData = await authService.createManager(dto);
      res.status(201).send(newUserData);
    } catch (error) {
      next(error);
    }
  }

  async logOutUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const accessToken = req.res!.locals.accessToken as string;

      await authService.logOutUser(accessToken);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const tokenPaylod = req.res!.locals.jwtPayload as TokenPayload;
      const refreshToken = req.res!.locals.refreshToken as string;

      const newTokenPair = await authService.refresToken(
        tokenPaylod,
        refreshToken
      );

      res.status(200).send(newTokenPair);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
