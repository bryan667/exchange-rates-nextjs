import { CurrencyOption } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const Select = dynamic(() => import('react-select'), { ssr: false });

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
  const [currencyOptions, setCurrencyOptions] =
    useState<CurrencyOption[]>(allCurrencyOptions);

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
    <>
      <Select
        className="basic-single min-w-[270px]"
        classNamePrefix="select"
        defaultValue={currencyOptions.find(
          (o) => o?.value === currencyOptions[0].value,
        )}
        value={selectedAddCurrency}
        onChange={(o: any) => {
          setSelectedAddCurrency({
            label: o.label,
            value: o.value,
          });
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
        className={`bg-white ml-2 hover:bg-gray-200 ${
          isButtonDisabled ? 'text-gray-300' : 'text-gray-800'
        } font-semibold py-2 px-4 border border-gray-400 rounded shadow`}
      >
        Add
      </button>
    </>
  );
}
