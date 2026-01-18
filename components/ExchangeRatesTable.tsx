'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import BaseCurrencyDropdownMenu from '@/components/BaseCurrencyDropdownMenu';
import { defaultParameters } from '@/lib/helpers';
import DatePicker from '@/components/DatePicker';
import Spinner from '@/components/Spinner';
import AddCurrencyDropdownMenu from '@/components/AddCurrencyDropdownMenu';
import CurrenciesIndicator from '@/components/CurrenciesIndicator';
import { CurrencyOption } from '@/lib/types';
import RemoveButton from '@/components/RemoveButton';

type TProps = {
  initialData: { date: string; [key: string]: any }[];
  allCurrencyOptions: CurrencyOption[];
  initialCurrencyFromUrl?: CurrencyOption;
};

export default function ExchangeRatesTable({
  initialData,
  allCurrencyOptions,
  initialCurrencyFromUrl,
}: TProps) {
  const [fetchedData, setFetchedData] = useState(() => initialData);
  const [selectedBaseCurrency, setSelectedBaseCurrency] =
    useState<CurrencyOption>(
      () => initialCurrencyFromUrl || defaultParameters.option,
    );
  const [selectedAddCurrency, setSelectedAddCurrency] =
    useState<CurrencyOption>(() => defaultParameters.option);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => defaultParameters.endDate,
  );
  const [tableCurrencies, setTableCurrencies] = useState(
    () => defaultParameters.selectedCurrencies,
  );
  const [isLoading, setIsLoading] = useState(false);

  const baseCurrency: string = selectedBaseCurrency.value;

  useEffect(() => {
    async function fetchExchangeHistory() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/exchange-history?end-date=${selectedDate}&base-currency=${baseCurrency}`,
        );
        const data = await res.json();
        setFetchedData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
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
      <div
        id="top-buttons"
        className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:gap-5"
      >
        {isLoading && <Spinner />}

        <div className="flex-1 min-w-[150px] sm:flex-none">
          <BaseCurrencyDropdownMenu
            selectedBaseCurrency={selectedBaseCurrency}
            setSelectedBaseCurrency={setSelectedBaseCurrency}
            allCurrencyOptions={allCurrencyOptions}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-end gap-2 sm:gap-3 min-h-[62px]">
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
            allCurrencyOptions={allCurrencyOptions}
          />
        </div>
      </div>

      <div
        id="table-component"
        className="overflow-x-auto mt-4 rounded-lg border border-gray-300"
      >
        <table className="min-w-full table-auto text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 py-2 sm:px-4">
                Currency
              </th>
              {matchingDates.map((d: string) => {
                const safeDate = new Date(d);
                const displayDate = isNaN(safeDate.getTime())
                  ? '--'
                  : format(safeDate, 'PP');

                return (
                  <th
                    key={d}
                    className="border border-gray-300 px-2 py-2 sm:px-4"
                  >
                    {displayDate}
                  </th>
                );
              })}
              <th className="border border-gray-300 px-2 py-2 sm:px-4"></th>
            </tr>
          </thead>
          <tbody>
            {tableCurrencies.map((currency, index) => (
              <tr key={currency} className="text-center">
                <td className="border border-gray-300 px-2 py-2 sm:px-4 font-bold">
                  {currency.toUpperCase()}
                </td>
                {matchingDates.map((date: string) => {
                  const matchingValue = dataMap[date]?.[currency];
                  return (
                    <td
                      key={date}
                      className="border border-gray-300 px-2 py-2 sm:px-4"
                    >
                      {matchingValue
                        ? Number(matchingValue.toFixed(4)).toLocaleString()
                        : '-'}
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
      </div>

      <CurrenciesIndicator tableCurrencies={tableCurrencies} />
    </>
  );
}
