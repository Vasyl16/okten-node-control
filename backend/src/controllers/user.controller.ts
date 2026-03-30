import { NextFunction, Request, Response } from 'express';

import { userService } from '../services/user.service';
import { TokenPayload } from '../types/token.type';

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const user = await userService.getCurrentUser(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const { firstName, lastName, phone } = req.body;
    const user = await userService.updateCurrentUser(userId, {
      firstName,
      lastName,
      phone,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId: callerUserId } = req.res!.locals.jwtPayload as TokenPayload;
    await userService.banUser(callerUserId, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    await userService.unbanUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
