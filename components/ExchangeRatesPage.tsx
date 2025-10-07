import ExchangeRatesTable from './ExchangeRatesTable';
import { defaultParameters } from '@/lib/helpers';

async function fetchInitialExchangeData() {
  const { endDate, baseCurrency } = defaultParameters;

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}`,
  );
  if (!res.ok) throw new Error('Failed to fetch exchange history');
  const data = await res.json();
  return data;
}

async function fetchAllCurrencyOptions() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/currencies`);
  if (!res.ok) throw new Error('Failed to fetch currency options');
  const data = await res.json();
  return data;
}

export default async function ExchangeRatesPage() {
  const initialData = await fetchInitialExchangeData();
  const allCurrencyOptions = await fetchAllCurrencyOptions();
  return (
    <div className="p-4 mx-auto max-w-7xl">
      <ExchangeRatesTable
        initialData={initialData}
        allCurrencyOptions={allCurrencyOptions}
      />
    </div>
  );
}
