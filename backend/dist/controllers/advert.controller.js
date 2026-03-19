"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMyAdverts = exports.listAdverts = exports.getAdvertStatistics = exports.getAdvertById = exports.deleteAdvert = exports.updateAdvert = exports.createAdvert = void 0;
const advert_service_1 = require("../services/advert.service");
const createAdvert = async (req, res, next) => {
    try {
        const { userId } = req.res.locals.jwtPayload;
        const dto = req.body;
        const advert = await advert_service_1.advertService.createAdvert(userId, {
            title: dto.title,
            description: dto.description,
            priceOriginal: Number(dto.priceOriginal),
            currencyOriginal: dto.currencyOriginal,
            modelId: Number(dto.modelId),
            regionId: Number(dto.regionId),
        });
        res.status(201).json(advert);
    }
    catch (error) {
        next(error);
    }
};
exports.createAdvert = createAdvert;
const updateAdvert = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { userId } = req.res.locals.jwtPayload;
        const dto = req.body;
        const advert = await advert_service_1.advertService.updateAdvert(id, userId, {
            title: dto.title,
            description: dto.description,
            priceOriginal: dto.priceOriginal !== undefined ? Number(dto.priceOriginal) : undefined,
            currencyOriginal: dto.currencyOriginal,
            modelId: dto.modelId !== undefined ? Number(dto.modelId) : undefined,
            regionId: dto.regionId !== undefined ? Number(dto.regionId) : undefined,
        });
        res.status(200).json(advert);
    }
    catch (error) {
        next(error);
    }
};
exports.updateAdvert = updateAdvert;
const deleteAdvert = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { userId } = req.res.locals.jwtPayload;
        await advert_service_1.advertService.deleteAdvert(id, userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAdvert = deleteAdvert;
const getAdvertById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const advert = await advert_service_1.advertService.getAdvertById(id);
        res.status(200).json(advert);
    }
    catch (error) {
        next(error);
    }
};
exports.getAdvertById = getAdvertById;
const getAdvertStatistics = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { userId } = req.res.locals.jwtPayload;
        const stats = await advert_service_1.advertService.getAdvertStatistics(id, userId);
        res.status(200).json(stats);
    }
    catch (error) {
        next(error);
    }
};
exports.getAdvertStatistics = getAdvertStatistics;
const listAdverts = async (req, res, next) => {
    try {
        const adverts = await advert_service_1.advertService.listAdverts();
        res.status(200).json(adverts);
    }
    catch (error) {
        next(error);
    }
};
exports.listAdverts = listAdverts;
const listMyAdverts = async (req, res, next) => {
    try {
        const { userId } = req.res.locals.jwtPayload;
        const adverts = await advert_service_1.advertService.listAdvertsByUser(userId);
        res.status(200).json(adverts);
    }
    catch (error) {
        next(error);
    }
};
exports.listMyAdverts = listMyAdverts;
