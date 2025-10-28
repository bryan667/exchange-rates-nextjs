'use client';
import { CurrencyOption } from '@/lib/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CurrencySelect, SingleValue } from './SelectButton';

type TProps = {
  tableCurrencies: string[];
  selectedAddCurrency: CurrencyOption;
  setSelectedAddCurrency: Dispatch<SetStateAction<CurrencyOption>>;
  setTableCurrencies: Dispatch<SetStateAction<string[]>>;
  allCurrencyOptions: CurrencyOption[];
};

export default function AddCurrencyDropdownMenu(props: TProps) {
  const {
    tableCurrencies,
    setTableCurrencies,
    selectedAddCurrency,
    setSelectedAddCurrency,
    allCurrencyOptions,
  } = props;
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>(
    () => allCurrencyOptions,
  );

  useEffect(() => {
    if (tableCurrencies && allCurrencyOptions) {
      const filteredData = [...allCurrencyOptions].filter(
        (opt: CurrencyOption) => !tableCurrencies.includes(opt.value),
      );
      setCurrencyOptions(filteredData);

      if (tableCurrencies.includes(selectedAddCurrency?.value)) {
        setSelectedAddCurrency(filteredData[0]);
      }
    }
  }, [tableCurrencies, allCurrencyOptions]);

  const isButtonDisabled =
    tableCurrencies.length >= 7 || !selectedAddCurrency?.value;

  return (
    <div className="flex w-full">
      <CurrencySelect
        className="basic-single min-w-[200px] sm:min-w-[270px] w-full"
        classNamePrefix="select"
        defaultValue={currencyOptions[0]}
        value={selectedAddCurrency}
        onChange={(option: SingleValue<CurrencyOption>) => {
          if (option !== null) {
            setSelectedAddCurrency({
              label: option?.label,
              value: option?.value,
            });
          }
        }}
        isDisabled={false}
        isLoading={false}
        isSearchable={true}
        name="color"
        options={currencyOptions}
      />
      <button
        disabled={isButtonDisabled}
        onClick={async () => {
          if (selectedAddCurrency) {
            setTableCurrencies((prev) => [...prev, selectedAddCurrency.value]);
          }
        }}
        className={`bg-white ml-2 hover:bg-gray-200 max-h-[38px] ${
          isButtonDisabled ? 'text-gray-300' : 'text-gray-800'
        } font-semibold py-2 px-4 border border-gray-400 rounded shadow`}
      >
        Add
      </button>
    </div>
  );
}
