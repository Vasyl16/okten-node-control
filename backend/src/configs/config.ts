import dotenv from 'dotenv';

import type { Config } from '../types/config.type';

dotenv.config();

export const config: Config = {
  app: {
    port: parseInt(process.env.APP_PORT as string),
    host: process.env.APP_HOST as string,
  },

  db: {
    uri: process.env.DB_URI as string,
  },

  token: {
    accessToken: process.env.JWT_ACCESS_SECRET as string,
    accessTokenExp: process.env.JWT_ACCESS_EXPIRATION as string,
    refreshToken: process.env.JWT_REFRESH_SECRET as string,
    refreshTokenExp: process.env.JWT_REFRESH_EXPIRATION as string,
  },

  jobs: {
    priceRecalcCron: process.env.PRICE_RECALC_CRON ?? '0 3 * * *',
  },

  external: {
    privatApiUrl:
      process.env.PRIVAT_API_URL ??
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
