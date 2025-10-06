import ExchangeRatesTable from './ExchangeRatesTable';
import { defaultParameters } from '@/lib/helpers';

async function fetchInitialExchangeData() {
  const { endDate, baseCurrency, selectedCurrenciesJoined } = defaultParameters;

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}&selected-currencies=${selectedCurrenciesJoined}`,
  );
  if (!res.ok) throw new Error('Failed to fetch exchange history');
  const data = await res.json();
  return data;
}

export default async function ExchangeRatesPage() {
  const initialData = await fetchInitialExchangeData();
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ExchangeRatesTable initialData={initialData} />
    </div>
  );
}
