'use client';
import BaseCurrencyDropdownMenu from '@/components/BaseCurrencyDropdownMenu';
import { useState, useEffect } from 'react';
import { defaultParameters } from '@/lib/helpers';
import DatePicker from '@/components/DatePicker';
import Spinner from '@/components/Spinner';
import { format } from 'date-fns';
import AddCurrencyDropdownMenu from '@/components/AddCurrencyDropdownMenu';
import { CurrencyOption } from '@/lib/types';
import RemoveButton from '@/components/RemoveButton';

type TProps = {
  initialData: any;
};

export default function ExchangeRatesTable({ initialData }: TProps) {
  const [fetchedData, setFetchedData] = useState(initialData);
  const [selectedBaseCurrency, setSelectedBaseCurrency] =
    useState<CurrencyOption>(defaultParameters.option);
  const [selectedAddCurrency, setSelectedAddCurrency] =
    useState<CurrencyOption>(defaultParameters.option);
  const [selectedDate, setSelectedDate] = useState<string>(
    defaultParameters.endDate,
  );
  const [tableCurrencies, setTableCurrencies] = useState(
    defaultParameters.selectedCurrencies,
  );
  const [isLoading, setIsLoading] = useState(false);

  const baseCurrency: string = selectedBaseCurrency.value;

  useEffect(() => {
    async function fetchExchangeHistory() {
      setIsLoading(true);
      const res = await fetch(
        `/api/exchange-history?end-date=${selectedDate}&base-currency=${baseCurrency}`,
      );
      const data = await res.json();
      setFetchedData(data);
      setIsLoading(false);
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

  return (
    <>
      <div id="top-buttons" className="mt-4 flex justify-between">
        {isLoading && <Spinner />}
        <div className="self-center">
          <BaseCurrencyDropdownMenu
            selectedBaseCurrency={selectedBaseCurrency}
            setSelectedBaseCurrency={setSelectedBaseCurrency}
          />
        </div>
        <div className="self-center flex items-end">
          <DatePicker
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            isLoading={isLoading}
          />
          <AddCurrencyDropdownMenu
            tableCurrencies={tableCurrencies}
            setTableCurrencies={setTableCurrencies}
            selectedAddCurrency={selectedAddCurrency}
            setSelectedAddCurrency={setSelectedAddCurrency}
          />
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
                    {matchingValue ? matchingValue.toFixed(4) : '-'}
                  </td>
                );
              })}
              <RemoveButton
                tableCurrencies={tableCurrencies}
                setTableCurrencies={setTableCurrencies}
                index={index}
              />
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-gray-500 mr-4 mt-2 self-center text-right">
        {tableCurrencies.length} / 7 currencies
      </div>
    </>
  );
}
