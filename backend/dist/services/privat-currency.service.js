"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRatesFromPrivat = void 0;
/* eslint-disable no-console */
const axios_1 = __importDefault(require("axios"));
const currency_rate_repo_1 = require("../db/repos/currency-rate.repo");
const errors_1 = require("../errors/errors");
const config_1 = require("../configs/config");
const updateRatesFromPrivat = async () => {
    const res = await axios_1.default.get(config_1.config.external.privatApiUrl);
    if (!res.data || !Array.isArray(res.data)) {
        throw new errors_1.InternalServerError('Failed to fetch rates from PrivatBank');
    }
    const data = res.data;
    const usd = data.find((row) => row.ccy === 'USD' && row.base_ccy === 'UAH');
    const eur = data.find((row) => row.ccy === 'EUR' && row.base_ccy === 'UAH');
    if (!usd || !eur) {
        throw new errors_1.InternalServerError('PrivatBank did not return USD/EUR rates');
    }
    const usdToUah = usd.sale;
    const eurToUah = eur.sale;
    // console.log(
    //   `[privat] fetched rates usdToUah=${usdToUah}, eurToUah=${eurToUah}`,
    // );
    await (0, currency_rate_repo_1.savePrivatRate)({ usdToUah, eurToUah });
};
exports.updateRatesFromPrivat = updateRatesFromPrivat;
