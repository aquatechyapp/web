import { maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import React, { forwardRef } from 'react';
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

export const InputMasked = forwardRef<HTMLInputElement, Props>(({ field, placeholder, name, form, mask, ...props }) => {
  const inputRef = useMaskito({ options: masks[mask] });
  let value = field.value;

  if (mask === 'currencyValue' && value) {
    // converte o valor recebido do backend (number) pra mascara de moeda
    value = maskitoTransform(insertDot(onlyNumbers(value.toString())).toFixed(2), masks[mask]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue: string | number = e.target.value;
    if (mask === 'currencyValue') {
      // quando for um input de moeda, removemos os pontos e virgulas e convertemos pra number
      newValue = onlyNumbers(newValue);
    }
    form.setValue(name, newValue);
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
});
