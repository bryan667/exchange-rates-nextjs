'use client';
import React, { useMemo } from 'react';
import { CurrencyOption } from '@/lib/types';
import { defaultParameters } from '@/lib/helpers';
import { CurrencySelect, SingleValue } from './SelectButton';

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

  const options = useMemo(() => [...allCurrencyOptions], [allCurrencyOptions]);
  const defaultValue = options.find(
    (o) => o?.value === defaultParameters?.baseCurrency,
  );

  return (
    <div className="min-w-[270px]">
      <div className="font-semibold">{`Base Currency: ${baseCurrencyText}`}</div>
      <CurrencySelect
        className="basic-single"
        classNamePrefix="select"
        defaultValue={defaultValue}
        value={selectedBaseCurrency}
        onChange={(option: SingleValue<CurrencyOption>) => {
          if (option !== null) {
            setSelectedBaseCurrency({
              label: option?.label,
              value: option?.value,
            });
          }
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
