import { maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import React from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { insertDot, onlyNumbers } from '@/utils';

import { Input } from '../ui/input';
import currencyMask from './currencyMask';
import percentMask from './percentMask';
import phoneMask from './phoneMask';

const masks = {
  currencyValue: currencyMask,
  percentValue: percentMask,
  phone: phoneMask
};

type Props = {
  field: ControllerRenderProps;
  placeholder: string;
  name: string;
  form: UseFormReturn;
  mask: 'currencyValue' | 'percentValue' | 'phone';
};

export const InputMasked = ({ field, placeholder, name, form, mask, ...props }: Props) => {
  const inputRef = useMaskito({ options: masks[mask] });
  let value = field.value;
  if (mask === 'currencyValue' && value) {
    value = insertDot(onlyNumbers(value.toString()));
    value = maskitoTransform(value.toFixed(2), masks[mask]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    if (mask === 'currencyValue') {
      value = onlyNumbers(value).toString();
    }
    form.setValue(name, value);
  }

  return (
    <Input
      type="tel"
      placeholder={placeholder}
      {...field}
      onInput={handleChange}
      ref={inputRef}
      {...props}
      value={value}
    />
  );
};
