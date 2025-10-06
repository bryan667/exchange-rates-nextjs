import ExchangeRatesTable from './ExchangeRatesTable';

async function fetchInitialExchangeHistory(
  date = '2025-10-07',
  currency = 'usd',
  matchingCurrencies = ['usd', 'eur', 'jpy', 'chf', 'cad', 'aud', 'zar'],
) {
  const res = await fetch(
    `${
      process.env.API_BASE_URL
    }/api/exchange-history?end-date=${date}&base-currency=${currency}&selected-currencies=${matchingCurrencies.join(
      ',',
    )}`,
  );
  if (!res.ok) throw new Error('Failed to fetch exchange history');
  const data = await res.json();
  return data;
}

export default async function ExchangeRatesPage() {
  const initialData = await fetchInitialExchangeHistory();

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <ExchangeRatesTable initialData={initialData} />
    </div>
  );
}
