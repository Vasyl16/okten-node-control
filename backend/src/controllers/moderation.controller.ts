import { NextFunction, Request, Response } from 'express';

import { moderationService } from '../services/moderation.service';

export const listQueue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ads = await moderationService.listQueue();
    res.status(200).json(ads);
  } catch (error) {
    next(error);
  }
};

export const approve = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { comment } = req.body ?? {};
    const advert = await moderationService.approve(id, comment);
    res.status(200).json(advert);
  } catch (error) {
    next(error);
  }
};

export const reject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { comment } = req.body ?? {};
    const advert = await moderationService.reject(id, comment);
    res.status(200).json(advert);
  } catch (error) {
    next(error);
  }
};
