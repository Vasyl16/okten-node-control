"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModelRequests = exports.getBrandRequests = exports.createModelRequest = exports.createBrandRequest = exports.createModel = exports.createBrand = exports.getRegions = exports.getModelsByBrandId = exports.getBrands = void 0;
const catalog_service_1 = require("../services/catalog.service");
const getBrands = async (req, res, next) => {
    try {
        const brands = await catalog_service_1.catalogService.getBrands();
        res.status(200).json(brands);
    }
    catch (error) {
        next(error);
    }
};
exports.getBrands = getBrands;
const getModelsByBrandId = async (req, res, next) => {
    try {
        const brandId = Number(req.params.id);
        const models = await catalog_service_1.catalogService.getModelsByBrandId(brandId);
        res.status(200).json(models);
    }
    catch (error) {
        next(error);
    }
};
exports.getModelsByBrandId = getModelsByBrandId;
const getRegions = async (req, res, next) => {
    try {
        const regions = await catalog_service_1.catalogService.getRegions();
        res.status(200).json(regions);
    }
    catch (error) {
        next(error);
    }
};
exports.getRegions = getRegions;
const createBrand = async (req, res, next) => {
    try {
        const { name } = req.body;
        const brand = await catalog_service_1.catalogService.createBrand(name);
        res.status(201).json(brand);
    }
    catch (error) {
        next(error);
    }
};
exports.createBrand = createBrand;
const createModel = async (req, res, next) => {
    try {
        const brandId = Number(req.params.id);
        const { name } = req.body;
        const model = await catalog_service_1.catalogService.createModel(brandId, name);
        res.status(201).json(model);
    }
    catch (error) {
        next(error);
    }
};
exports.createModel = createModel;
const createBrandRequest = async (req, res, next) => {
    try {
        const { requestedName, comment } = req.body;
        const { userId } = req.res.locals.jwtPayload;
        const request = await catalog_service_1.catalogService.createBrandRequest(userId, requestedName, comment);
        res.status(201).json(request);
    }
    catch (error) {
        next(error);
    }
};
exports.createBrandRequest = createBrandRequest;
const createModelRequest = async (req, res, next) => {
    try {
        const { requestedName, comment, brandId } = req.body;
        const { userId } = req.res.locals.jwtPayload;
        const request = await catalog_service_1.catalogService.createModelRequest(userId, Number(brandId), requestedName, comment);
        res.status(201).json(request);
    }
    catch (error) {
        next(error);
    }
};
exports.createModelRequest = createModelRequest;
const getBrandRequests = async (req, res, next) => {
    try {
        const requests = await catalog_service_1.catalogService.getBrandRequests();
        res.status(200).json(requests);
    }
    catch (error) {
        next(error);
    }
};
exports.getBrandRequests = getBrandRequests;
const getModelRequests = async (req, res, next) => {
    try {
        const requests = await catalog_service_1.catalogService.getModelRequests();
        res.status(200).json(requests);
    }
    catch (error) {
        next(error);
    }
};
exports.getModelRequests = getModelRequests;
