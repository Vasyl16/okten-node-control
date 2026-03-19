"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPrice = exports.convertPriceWithRates = exports.getLatestRates = void 0;
const currencyRateRepo = __importStar(require("../db/repos/currency-rate.repo"));
const errors_1 = require("../errors/errors");
const getLatestRates = async () => {
    const latest = await currencyRateRepo.getLatestRate();
    const usdToUah = Number(latest.usdToUah);
    const eurToUah = Number(latest.eurToUah);
    if (!usdToUah || !eurToUah) {
        throw new errors_1.InternalServerError('Invalid currency rates configuration');
    }
    return { usdToUah, eurToUah };
};
exports.getLatestRates = getLatestRates;
const convertPriceWithRates = (amount, from, rates) => {
    const { usdToUah, eurToUah } = rates;
    let amountInUah = amount;
    if (from === 'USD') {
        amountInUah = amount * usdToUah;
    }
    else if (from === 'EUR') {
        amountInUah = amount * eurToUah;
    }
    const priceUah = amountInUah;
    const priceUsd = amountInUah / usdToUah;
    const priceEur = amountInUah / eurToUah;
    return {
        priceUsd: Number(priceUsd.toFixed(2)),
        priceEur: Number(priceEur.toFixed(2)),
        priceUah: Number(priceUah.toFixed(2)),
    };
};
exports.convertPriceWithRates = convertPriceWithRates;
const convertPrice = async (amount, from) => {
    const rates = await (0, exports.getLatestRates)();
    return (0, exports.convertPriceWithRates)(amount, from, rates);
};
exports.convertPrice = convertPrice;
