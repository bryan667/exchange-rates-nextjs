'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CurrencyOption } from '@/lib/types';
import { defaultParameters } from '@/lib/helpers';

const Select = dynamic(() => import('react-select'), { ssr: false });

type TProps = {
  selectedBaseCurrency: CurrencyOption;
  setSelectedBaseCurrency: (option: CurrencyOption) => void;
};

export default function BaseCurrencyDropdownMenu(props: TProps) {
  const { selectedBaseCurrency, setSelectedBaseCurrency } = props;
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);

  useEffect(() => {
    async function fetchCurrencies() {
      const res = await fetch(`/api/currencies`);
      const data = await res.json();
      setCurrencyOptions(data);
    }

    fetchCurrencies();
  }, []);

  return (
    <div className="min-w-[270px]">
      {selectedBaseCurrency && (
        <div className="font-semibold">{`Base Currency: ${selectedBaseCurrency?.value?.toUpperCase()}`}</div>
      )}
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={currencyOptions.find(
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
        options={currencyOptions}
      />
    </div>
  );
}
