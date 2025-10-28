import { CurrencyOption } from '@/lib/types';
import { Props as SelectProps, SingleValue } from 'react-select';

import dynamic from 'next/dynamic';
export const CurrencySelect = dynamic<SelectProps<CurrencyOption, false>>(
  () => import('react-select'),
  { ssr: false },
);

export type { SelectProps, SingleValue };
