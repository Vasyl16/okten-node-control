import * as currencyRateRepo from '../db/repos/currency-rate.repo';
import { InternalServerError } from '../errors/errors';

export type Currency = 'USD' | 'EUR' | 'UAH';

export type CurrencyRates = {
  usdToUah: number;
  eurToUah: number;
};

export const getLatestRates = async (): Promise<CurrencyRates> => {
  const latest = await currencyRateRepo.getLatestRate();

  const usdToUah = Number(latest.usdToUah);
  const eurToUah = Number(latest.eurToUah);

  if (!usdToUah || !eurToUah) {
    throw new InternalServerError('Invalid currency rates configuration');
  }

  return { usdToUah, eurToUah };
};

export const convertPriceWithRates = (
  amount: number,
  from: Currency,
  rates: CurrencyRates,
): {
  priceUsd: number;
  priceEur: number;
  priceUah: number;
} => {
  const { usdToUah, eurToUah } = rates;

  let amountInUah = amount;
  if (from === 'USD') {
    amountInUah = amount * usdToUah;
  } else if (from === 'EUR') {
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

export const convertPrice = async (
  amount: number,
  from: Currency,
): Promise<{
  priceUsd: number;
  priceEur: number;
  priceUah: number;
}> => {
  const rates = await getLatestRates();
  return convertPriceWithRates(amount, from, rates);
};

