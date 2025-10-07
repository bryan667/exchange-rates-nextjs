'use client';
import CurrencyDropdownMenu from '@/components/CurrencyDropdownMenu';
import { useState, useEffect } from 'react';
import { defaultParameters } from '@/lib/helpers';

type TProps = {
  initialData: any;
};

export default function ExchangeRatesTable({ initialData }: TProps) {
  const endDate = defaultParameters.endDate;

  const [fetchedData, setFetchedData] = useState(initialData);
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState(
    defaultParameters.option,
  );
  const [tableCurrencies, setTableCurrencies] = useState(
    defaultParameters.selectedCurrencies,
  );

  const baseCurrency: string = selectedBaseCurrency.value;

  useEffect(() => {
    async function fetchExchangeHistory() {
      const res = await fetch(
        `/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}`,
      );
      const data = await res.json();
      setFetchedData(data);
    }
    fetchExchangeHistory();
  }, [baseCurrency]);

  const dataMap: Record<string, Record<string, number>> = {};
  const matchingDates = fetchedData.map(
    (data: { date: string; [key: string]: any }) => {
      const allKeys = Object.keys(data);
      const date = data.date;
      const newCurrency = allKeys[1];
      dataMap[date] = data[newCurrency];
      return date;
    },
  );

  return (
    <>
      <CurrencyDropdownMenu
        selectedBaseCurrency={selectedBaseCurrency}
        setSelectedBaseCurrency={setSelectedBaseCurrency}
      />
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Currency</th>
            {matchingDates.map((d: string) => (
              <th key={d} className="border border-gray-300 px-4 py-2">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableCurrencies.map((currency, index) => {
            return (
              <tr key={currency} className="text-center">
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {currency.toUpperCase()}
                </td>
                {matchingDates.map((date: string) => {
                  const matchingValue = dataMap[date][currency];
                  return (
                    <td key={date} className="border border-gray-300 px-4 py-2">
                      <div>{matchingValue ?? '-'}</div>
                    </td>
                  );
                })}
                <td className="px-3 py-2 flex justify-between items-center">
                  <button
                    disabled={tableCurrencies.length <= 3}
                    onClick={() =>
                      setTableCurrencies((prev) =>
                        prev.filter((_, i) => i !== index),
                      )
                    }
                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                  >
                    -
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        className="bg-white hover:bg-gray-100 text-gray-800 mt-4 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        disabled={tableCurrencies.length >= 7}
        onClick={() => setTableCurrencies((prev) => [...prev, 'usd'])}
      >
        Add Currency
      </button>
    </>
  );
}
