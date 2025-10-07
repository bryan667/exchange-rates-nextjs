import React from 'react';
import dynamic from 'next/dynamic';
import { CurrencyOption } from '@/lib/types';
import { defaultParameters } from '@/lib/helpers';

const Select = dynamic(() => import('react-select'), { ssr: false });

type TProps = {
  selectedBaseCurrency: CurrencyOption;
  setSelectedBaseCurrency: (option: CurrencyOption) => void;
  allCurrencyOptions: CurrencyOption[];
};

export default function BaseCurrencyDropdownMenu(props: TProps) {
  const { selectedBaseCurrency, setSelectedBaseCurrency, allCurrencyOptions } =
    props;

  const baseCurrencyText = selectedBaseCurrency
    ? selectedBaseCurrency?.value?.toUpperCase()
    : '--';

  const options = [...allCurrencyOptions];
  return (
    <div className="min-w-[270px]">
      <div className="font-semibold">{`Base Currency: ${baseCurrencyText}`}</div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={allCurrencyOptions.find(
          (o) => o?.value === defaultParameters.baseCurrency,
        )}
        value={selectedBaseCurrency}
        onChange={(o: any) => {
          setSelectedBaseCurrency({
            label: o.label,
            value: o.value,
          });
        }}
        isDisabled={false}
        isLoading={false}
        isSearchable={true}
        name="color"
        options={options}
      />
    </div>
  );
}
