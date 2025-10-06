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

  const baseCurrency: string = selectedBaseCurrency.value;
  const matchingCurrencies = defaultParameters.selectedCurrencies;

  useEffect(() => {
    async function fetchExchangeHistory() {
      const selectedCurrencies = defaultParameters.selectedCurrenciesJoined;
      const res = await fetch(
        `/api/exchange-history?end-date=${endDate}&base-currency=${baseCurrency}&selected-currencies=${selectedCurrencies}`,
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
          {matchingCurrencies.map((currency, index) => {
            return (
              <tr key={currency} className="text-center">
                <td className="border border-gray-300 px-4 py-2 font-bold">
                  {currency.toUpperCase()}
                </td>
                {matchingDates.map((date: string) => {
                  const matchingValue = dataMap[date][currency];
                  return (
                    <td key={date} className="border border-gray-300 px-4 py-2">
                      <div>{matchingValue}</div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
