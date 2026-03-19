import { NextFunction, Request, Response } from 'express';

import * as tokenRepo from '../db/repos/token.repo';
import { UnathorizedError } from '../errors/errors';
import { tokenService } from '../services/token.service';

export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnathorizedError('Access tokes is not provide');
    }

    const accessToken = authHeader.split('Bearer ')[1];

    const payload = tokenService.verifyToken(accessToken, 'accessToken');

    const pairToken = await tokenRepo.findTokenPairByAccessToken(accessToken);

    if (!pairToken) {
      throw new UnathorizedError('Token is invalid');
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
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnathorizedError('Access tokes is not provide');
    }

    const refreshToken = authHeader.split('Bearer ')[1];

    const payload = tokenService.verifyToken(refreshToken, 'refreshToken');

    const pairToken = await tokenRepo.findTokenPairByRefreshToken(refreshToken);

    if (!pairToken) {
      throw new UnathorizedError('Token is invalid');
    }

    req.res!.locals.jwtPayload = payload;
    req.res!.locals.refreshToken = refreshToken;

    next();
  } catch (error) {
    next(error);
  }
};
