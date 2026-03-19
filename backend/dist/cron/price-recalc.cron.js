"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPriceRecalcCron = void 0;
/* eslint-disable no-console */
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("../configs/config");
const advert_service_1 = require("../services/advert.service");
const privat_currency_service_1 = require("../services/privat-currency.service");
const startPriceRecalcCron = () => {
    const schedule = config_1.config.jobs.priceRecalcCron;
    node_cron_1.default.schedule(schedule, async () => {
        try {
            await (0, privat_currency_service_1.updateRatesFromPrivat)();
            const { updated } = await advert_service_1.advertService.recalcAllAdPrices();
            // console.log(`[cron] prices recalculated for ${updated} ads`);
        }
        catch (error) {
            console.error('[cron] price recalculation failed', error);
        }
    });
};
exports.startPriceRecalcCron = startPriceRecalcCron;
