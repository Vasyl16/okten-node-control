/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express';

import { config } from './configs/config';
import { startPriceRecalcCron } from './cron/price-recalc.cron';
import { checkDatabaseConnection } from './db/drizzle';
import { AppError, ValidationError } from './errors/errors';
import advertRouter from './router/advert.router';
import authRouter from './router/auth.router';
import catalogRouter from './router/catalog.router';
import moderationRouter from './router/moderation.router';
import userRouter from './router/user.router';

const app = express();

app.use(express.json());

app.use('/users', userRouter);
app.use('/auth', authRouter);
app.use('/catalog', catalogRouter);
app.use('/ads', advertRouter);
app.use('/moderation', moderationRouter);

app.use(
  (
    err: AppError | ValidationError,
    req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    console.log(err);

    if (err instanceof ValidationError) {
      res.status(err.status || 500).json({
        message: err.message,
        fields: err.fields,
      });
      return;
    }

    console.log(err);

    res.status(err?.status || 500).json({
      message: err.message,
    });
  },
);

const appConfig = config.app;

const bootstrap = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    console.log('Database connection is OK');
  } catch (error) {
    console.error('Database connection failed. App startup aborted.', error);
    process.exit(1);
  }

  startPriceRecalcCron();

  app.listen(appConfig.port, () => {
    console.log(`Server running on http://${appConfig.host}:${appConfig.port}`);
  });
};

void bootstrap();
