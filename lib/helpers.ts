export function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function filterUnwantedCurrencies({
  fullData,
  baseCurrency,
  uniqSelectedCurrencies,
}: {
  fullData: { [key: string]: any }[];
  baseCurrency: string;
  uniqSelectedCurrencies: string[];
}) {
  const filteredData = [];
  for (const data of fullData) {
    const newData = {
      date: data.date,
      [baseCurrency]: {},
    };
    uniqSelectedCurrencies.forEach((match) => {
      if (data[baseCurrency]?.[match] !== undefined) {
        newData[baseCurrency][match] = data[baseCurrency][match];
      }
    });
    filteredData.push(newData);
  }
  return filteredData;
}

export function parseSelectedCurrencies({
  selectedCurrenciesParams,
}: {
  selectedCurrenciesParams: string;
}) {
  const MAX_CURRENCIES = 7; //allow only max of 7 currency filter
  let selectedCurrencies = new Set(
    selectedCurrenciesParams
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean),
  );
  const uniqSelectedCurrencies = Array.from(selectedCurrencies).slice(
    0,
    MAX_CURRENCIES,
  );
  return uniqSelectedCurrencies;
}
