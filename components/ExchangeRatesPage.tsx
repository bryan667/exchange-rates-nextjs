import ExchangeRatesTable from './ExchangeRatesTable';
import { defaultParameters } from '@/lib/helpers';

async function fetchInitialExchangeData() {
  const { endDate, baseCurrency } = defaultParameters;
  const res = await fetch(
    `${process.env.API_BASE_URL}/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}`,
  );
  if (!res.ok)
    return [{ error: true, errorMessage: 'failed to fetch exchange data' }];
  const data = await res.json();
  return data;
}

async function fetchAllCurrencyOptions() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/currencies`);
  if (!res.ok)
    return [{ error: true, errorMessage: 'failed to fetch currency data' }];
  const data = await res.json();
  return data;
}

export default async function ExchangeRatesPage() {
  const initialData = await fetchInitialExchangeData();
  const allCurrencyOptions = await fetchAllCurrencyOptions();

  const hasExchangeError = initialData[0]?.error;
  const hasCurrencyError = allCurrencyOptions[0]?.error;

  return (
    <div className="p-4 mx-auto max-w-7xl">
      {hasExchangeError && (
        <div className="text-center text-red-500 text-sm">
          Failed to load exchange data
        </div>
      )}
      {hasCurrencyError && (
        <div className="text-center text-red-500 text-sm">
          Failed to load currencies
        </div>
      )}
      <ExchangeRatesTable
        initialData={initialData}
        allCurrencyOptions={allCurrencyOptions}
      />
    </div>
  );
}
