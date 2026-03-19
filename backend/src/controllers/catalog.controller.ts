import { NextFunction, Request, Response } from 'express';

import { catalogService } from '../services/catalog.service';
import { TokenPayload } from '../types/token.type';

export const getBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await catalogService.getBrands();
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

export const getModelsByBrandId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandId = Number(req.params.id);
    const models = await catalogService.getModelsByBrandId(brandId);
    res.status(200).json(models);
  } catch (error) {
    next(error);
  }
};

export const getRegions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const regions = await catalogService.getRegions();
    res.status(200).json(regions);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const brand = await catalogService.createBrand(name);
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
};

export const createModel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandId = Number(req.params.id);
    const { name } = req.body;
    const model = await catalogService.createModel(brandId, name);
    res.status(201).json(model);
  } catch (error) {
    next(error);
  }
};

export const createBrandRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { requestedName, comment } = req.body;
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const request = await catalogService.createBrandRequest(
      userId,
      requestedName,
      comment,
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const createModelRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { requestedName, comment, brandId } = req.body;
    const { userId } = req.res!.locals.jwtPayload as TokenPayload;
    const request = await catalogService.createModelRequest(
      userId,
      Number(brandId),
      requestedName,
      comment,
    );
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const getBrandRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requests = await catalogService.getBrandRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getModelRequests = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const requests = await catalogService.getModelRequests();
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};
