import ExchangeRatesTable from './ExchangeRatesTable';
import { getBaseUrl, defaultParameters } from '@/lib/helpers';

async function fetchInitialExchangeData() {
  const baseURL = getBaseUrl();
  const { endDate, baseCurrency } = defaultParameters;
  try {
    const res = await fetch(
      `${baseURL}/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}`,
    );
    if (!res.ok)
      return [{ error: true, errorMessage: 'failed to fetch exchange data' }];

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Initial fetch failed:', err);
    return [{ error: true, errorMessage: 'failed to fetch exchange data' }];
  }
}

async function fetchAllCurrencyOptions() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/api/currencies`);

    if (!res.ok)
      return [{ error: true, errorMessage: 'Failed to fetch currency data' }];

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching currency options:', err);
    return [{ error: true, errorMessage: 'Failed to fetch currency data' }];
  }
}

export default async function ExchangeRatesPage() {
  const [initialData, allCurrencyOptions] = await Promise.all([
    fetchInitialExchangeData(),
    fetchAllCurrencyOptions(),
  ]);

  const hasExchangeError = initialData[0]?.error;
  const hasCurrencyError = allCurrencyOptions[0]?.error;

  return (
    <div className="p-1 sm:p-4 mx-auto max-w-7xl">
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
