import { NextFunction, Request, Response } from 'express';

import * as tokenRepo from '../db/repos/token.repo';
import { UnauthorizedError } from '../errors/errors';
import { tokenService } from '../services/token.service';

export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Access token is not provided');
    }

    const accessToken = authHeader.split('Bearer ')[1];

    const payload = tokenService.verifyToken(accessToken, 'accessToken');

    const pairToken = await tokenRepo.findTokenPairByAccessToken(accessToken);

    if (!pairToken) {
      throw new UnauthorizedError('Token is invalid');
    }

    req.res!.locals.jwtPayload = payload;
    req.res!.locals.accessToken = accessToken;

    next();
  } catch (error) {
    next(error);
  }
};

export const checkRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Refresh token is not provided');
    }

    const refreshToken = authHeader.split('Bearer ')[1];

    const payload = tokenService.verifyToken(refreshToken, 'refreshToken');

    const pairToken = await tokenRepo.findTokenPairByRefreshToken(refreshToken);

    if (!pairToken) {
      throw new UnauthorizedError('Token is invalid');
    }

    req.res!.locals.jwtPayload = payload;
    req.res!.locals.refreshToken = refreshToken;

    next();
  } catch (error) {
    next(error);
  }
};
