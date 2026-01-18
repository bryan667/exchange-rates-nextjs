'use client';
import React, { useMemo } from 'react';
import { CurrencyOption } from '@/lib/types';
import { defaultParameters } from '@/lib/helpers';
import { CurrencySelect, SingleValue } from './SelectButton';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

type TProps = {
  selectedBaseCurrency: CurrencyOption;
  setSelectedBaseCurrency: (option: CurrencyOption) => void;
  allCurrencyOptions: CurrencyOption[];
};

export default function BaseCurrencyDropdownMenu(props: TProps) {
  const { selectedBaseCurrency, setSelectedBaseCurrency, allCurrencyOptions } =
    props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const baseCurrencyText = selectedBaseCurrency
    ? selectedBaseCurrency?.value?.toUpperCase()
    : '--';

  const options = useMemo(() => [...allCurrencyOptions], [allCurrencyOptions]);
  const defaultValue = options.find(
    (o) => o?.value === defaultParameters?.baseCurrency,
  );

  const onDropDownMenuChange = (option: SingleValue<CurrencyOption>) => {
    if (option !== null) {
      setSelectedBaseCurrency({
        label: option?.label,
        value: option?.value,
      });
    }

    const currency = option?.value.toLowerCase() || '';
    const params = new URLSearchParams(searchParams);
    if (currency) {
      params.set('currency', currency);
    } else {
      params.delete('currency');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-w-[270px]">
      <div className="font-semibold">{`Base Currency: ${baseCurrencyText}`}</div>
      <CurrencySelect
        className="basic-single"
        classNamePrefix="select"
        defaultValue={defaultValue}
        value={selectedBaseCurrency}
        onChange={onDropDownMenuChange}
        isDisabled={false}
        isLoading={false}
        isSearchable={true}
        name="color"
        options={options}
      />
    </div>
  );
}
