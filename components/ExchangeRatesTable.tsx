'use client';
import CurrencyDropdownMenu from '@/components/CurrencyDropdownMenu';
import { useState, useEffect } from 'react';
import { defaultParameters } from '@/lib/helpers';
import DatePicker from '@/components/DatePicker';
import { format, subDays } from 'date-fns';

type TProps = {
  initialData: any;
};

export default function ExchangeRatesTable({ initialData }: TProps) {
  const [fetchedData, setFetchedData] = useState(initialData);
  const [selectedBaseCurrency, setSelectedBaseCurrency] = useState(
    defaultParameters.option,
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    defaultParameters.endDate,
  );
  const [tableCurrencies, setTableCurrencies] = useState(
    defaultParameters.selectedCurrencies,
  );

  const baseCurrency: string = selectedBaseCurrency.value;

  useEffect(() => {
    async function fetchExchangeHistory() {
      const res = await fetch(
        `/api/exchange-history?end-date=${selectedDate}&base-currency=${baseCurrency}`,
      );
      const data = await res.json();
      setFetchedData(data);
    }
    fetchExchangeHistory();
  }, [baseCurrency, selectedDate]);

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

  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  useEffect(() => {
    async function fetchCurrencies() {
      const res = await fetch(`/api/currencies`);
      const data = await res.json();
      const values = data.map((d: any) => {
        return d.value;
      });
      setAvailableCurrencies(values);
    }

    fetchCurrencies();
  }, []);

  const addableCurrencies = availableCurrencies.filter(
    (c) => !tableCurrencies.includes(c),
  );

  return (
    <>
      <div id="top-buttons" className="mt-4 flex justify-between">
        <div className="self-center">
          <CurrencyDropdownMenu
            selectedBaseCurrency={selectedBaseCurrency}
            setSelectedBaseCurrency={setSelectedBaseCurrency}
          />
        </div>
        <div className="self-center">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <span className="text-gray-500 mr-4 self-center">
            {tableCurrencies.length} / 7 currencies
          </span>
          <button
            disabled={
              tableCurrencies.length >= 7 || addableCurrencies.length === 0
            }
            onClick={() => {
              setTableCurrencies((prev) => [...prev, addableCurrencies[0]]);
            }}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Add Currency
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Currency</th>
            {matchingDates.map((d: string) => (
              <th key={d} className="border border-gray-300 px-4 py-2">
                {format(d, 'PP')}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {tableCurrencies.map((currency, index) => (
            <tr key={currency} className="text-center">
              <td className="border border-gray-300 px-4 py-2 font-bold">
                {currency.toUpperCase()}
              </td>
              {matchingDates.map((date: string) => {
                const matchingValue = dataMap[date]?.[currency];
                return (
                  <td key={date} className="border border-gray-300 px-4 py-2">
                    {matchingValue ?? '-'}
                  </td>
                );
              })}
              <td className="border-b border-gray-300 px-3 py-2 flex justify-center">
                <button
                  disabled={tableCurrencies.length <= 3}
                  onClick={() =>
                    setTableCurrencies((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
