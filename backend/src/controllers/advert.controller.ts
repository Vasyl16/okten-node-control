import { NextFunction, Request, Response } from 'express';

import { advertService } from '../services/advert.service';
import { TokenPayload } from '../types/token.type';

const parseListQuery = (req: Request) => {
  const pageRaw = Number(req.query.page);
  const limitRaw = Number(req.query.limit);
  const sortByRaw = String(req.query.sortBy ?? 'createdAt');
  const sortOrderRaw = String(req.query.sortOrder ?? 'desc');

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limitCandidate =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.floor(limitRaw) : 10;
  const limit = Math.min(limitCandidate, 100);

  const sortBy = ['createdAt', 'updatedAt', 'priceUah'].includes(sortByRaw)
    ? (sortByRaw as 'createdAt' | 'updatedAt' | 'priceUah')
    : 'createdAt';
  const sortOrder: 'asc' | 'desc' = sortOrderRaw === 'asc' ? 'asc' : 'desc';

  return { page, limit, sortBy, sortOrder };
};

export const createAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const dto = req.body;
    const advert = await advertService.createAdvert(userId, {
      title: dto.title,
      description: dto.description,
      priceOriginal: Number(dto.priceOriginal),
      currencyOriginal: dto.currencyOriginal,
      modelId: Number(dto.modelId),
      regionId: Number(dto.regionId),
    });
    res.status(201).json(advert);
  } catch (error) {
    next(error);
  }
};

export const updateAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const dto = req.body;
    const advert = await advertService.updateAdvert(id, userId, {
      title: dto.title,
      description: dto.description,
      priceOriginal:
        dto.priceOriginal !== undefined ? Number(dto.priceOriginal) : undefined,
      currencyOriginal: dto.currencyOriginal,
      modelId: dto.modelId !== undefined ? Number(dto.modelId) : undefined,
      regionId: dto.regionId !== undefined ? Number(dto.regionId) : undefined,
    });
    res.status(200).json(advert);
  } catch (error) {
    next(error);
  }
};

export const deleteAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    await advertService.deleteAdvert(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAdvertById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const advert = await advertService.getAdvertById(id);
    res.status(200).json(advert);
  } catch (error) {
    next(error);
  }
};

export const getAdvertStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const stats = await advertService.getAdvertStatistics(id, userId);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

export const listAdverts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const query = parseListQuery(req);
    const adverts = await advertService.listAdverts(query);
    res.status(200).json(adverts);
  } catch (error) {
    next(error);
  }
};

export const listMyAdverts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const query = parseListQuery(req);
    const adverts = await advertService.listAdvertsByUser(userId, query);
    res.status(200).json(adverts);
  } catch (error) {
    next(error);
  }
};
