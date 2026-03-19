/* eslint-disable no-console */
import cron from 'node-cron';

import { config } from '../configs/config';
import { advertService } from '../services/advert.service';
import { updateRatesFromPrivat } from '../services/privat-currency.service';

export const startPriceRecalcCron = () => {
  const schedule = config.jobs.priceRecalcCron;

  cron.schedule(schedule, async () => {
    try {
      await updateRatesFromPrivat();
      const { updated } = await advertService.recalcAllAdPrices();
      // console.log(`[cron] prices recalculated for ${updated} ads`);
    } catch (error) {
      console.error('[cron] price recalculation failed', error);
    }
  });
};
