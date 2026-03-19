"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reject = exports.approve = exports.listQueue = void 0;
const moderation_service_1 = require("../services/moderation.service");
const listQueue = async (req, res, next) => {
    try {
        const ads = await moderation_service_1.moderationService.listQueue();
        res.status(200).json(ads);
    }
    catch (error) {
        next(error);
    }
};
exports.listQueue = listQueue;
const approve = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { comment } = req.body ?? {};
        const advert = await moderation_service_1.moderationService.approve(id, comment);
        res.status(200).json(advert);
    }
    catch (error) {
        next(error);
    }
};
exports.approve = approve;
const reject = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { comment } = req.body ?? {};
        const advert = await moderation_service_1.moderationService.reject(id, comment);
        res.status(200).json(advert);
    }
    catch (error) {
        next(error);
    }
};
exports.reject = reject;
