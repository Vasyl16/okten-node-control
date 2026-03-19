/* eslint-disable no-console */
import axios from 'axios';

import { savePrivatRate } from '../db/repos/currency-rate.repo';
import { InternalServerError } from '../errors/errors';
import { config } from '../configs/config';

type PrivatCurrencyRow = {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
};

export const updateRatesFromPrivat = async () => {
  const res = await axios.get<PrivatCurrencyRow[]>(config.external.privatApiUrl);

  if (!res.data || !Array.isArray(res.data)) {
    throw new InternalServerError('Failed to fetch rates from PrivatBank');
  }

  const data = res.data;

  const usd = data.find((row) => row.ccy === 'USD' && row.base_ccy === 'UAH');
  const eur = data.find((row) => row.ccy === 'EUR' && row.base_ccy === 'UAH');

  if (!usd || !eur) {
    throw new InternalServerError('PrivatBank did not return USD/EUR rates');
  }

  const usdToUah = usd.sale;
  const eurToUah = eur.sale;

  // console.log(
  //   `[privat] fetched rates usdToUah=${usdToUah}, eurToUah=${eurToUah}`,
  // );

  await savePrivatRate({ usdToUah, eurToUah });
};
