"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getRequiredEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env variable: ${name}`);
    }
    return value;
};
const appPortRaw = process.env.APP_PORT ?? process.env.PORT ?? '3000';
const appPort = Number.parseInt(appPortRaw, 10);
if (Number.isNaN(appPort)) {
    throw new Error(`Invalid APP_PORT value: ${appPortRaw}`);
}
exports.config = {
    app: {
        port: appPort,
        host: process.env.APP_HOST ?? '0.0.0.0',
    },
    db: {
        uri: getRequiredEnv('DB_URI'),
    },
    token: {
        accessToken: getRequiredEnv('JWT_ACCESS_SECRET'),
        accessTokenExp: getRequiredEnv('JWT_ACCESS_EXPIRATION'),
        refreshToken: getRequiredEnv('JWT_REFRESH_SECRET'),
        refreshTokenExp: getRequiredEnv('JWT_REFRESH_EXPIRATION'),
    },
    jobs: {
        priceRecalcCron: process.env.PRICE_RECALC_CRON ?? '0 3 * * *',
    },
    external: {
        privatApiUrl: process.env.PRIVAT_API_URL ??
            'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
    },
    // aws: {
    //   accessKey: process.env.AWS_ACCESS_KEY as string,
    //   secretKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    //   region: process.env.AWS_REGION as string,
    //   s3BucketName: process.env.AWS_S3_BUTCKET_NAME as string,
    //   s3Endpoint: process.env.AWS_S3_ENDPOINT as string,
    //   s3ACL: process.env.AWS_S3_ACL as ObjectCannedACL,
    // },
};
