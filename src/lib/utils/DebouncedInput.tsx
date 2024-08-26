import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react';

import { Input } from '../../common/input/input';
import {useTranslation} from "@/lib/hooks/useTranslation";

type Props = {
  callback: (value: string) => void;
  clearSearch?: '' | null
  setClearSearch: (val: '' | null) => void
  language: 'en' | 'ru'
} & Omit<ComponentPropsWithoutRef<'input'>, 'onChange'>;

const DebouncedInput = ({ callback, language, ...rest }: Props) => {
  const {t} = useTranslation(language)
  const [debouncedValue, setDebouncedValue] = useState<null | string>(null);
  const [valueInput, setValueInput] = useState<string>('');

  useEffect(() => {
    rest.clearSearch === '' && setValueInput('')
    const debounceTimeout = setTimeout(() => {
      if (debouncedValue !== null) {
        callback(debouncedValue);
        setDebouncedValue(null);
      }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout)
      rest.setClearSearch(null)
    };
  }, [debouncedValue, callback, rest.clearSearch]);

  const handleInputChange = (e: string) => {
    setValueInput(e);
    setDebouncedValue(e);
  };

  return (
    <Input
      {...rest}
      value={valueInput}
      onChangeValue={handleInputChange}
      placeholder={t.Search}
      type={'search'}
    />
  );
};

export default DebouncedInput;
