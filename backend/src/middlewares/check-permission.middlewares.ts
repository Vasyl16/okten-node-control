// permissions.middleware.ts
import { NextFunction, Request, Response } from 'express';

import * as userRepo from '../db/repos/user.repo';
import { ForbiddenError, UnauthorizedError } from '../errors/errors';
import { TokenPayload } from '../types/token.type';

export const checkPermission = (required: string | string[]) => {
  const requiredPermissions = Array.isArray(required) ? required : [required];

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.res?.locals.jwtPayload as TokenPayload;

      if (!userId) {
        throw new UnauthorizedError('Unauthorized');
      }

      const user = await userRepo.getFullUserById(userId);

      if (!user) {
        throw new UnauthorizedError('Unauthorized');
      }

      const userPermissions: string[] = user.permissions ?? [];

      const hasPermission = requiredPermissions.some((perm) =>
        userPermissions.includes(perm),
      );

      if (!hasPermission) {
        throw new ForbiddenError('You do not have permission for this action');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
