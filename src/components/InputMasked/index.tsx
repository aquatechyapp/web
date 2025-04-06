import { maskitoTransform } from '@maskito/core';
import { useMaskito } from '@maskito/react';
import React, { forwardRef } from 'react';
import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { insertDot, onlyNumbers } from '@/utils';

import { Input } from '../ui/input';
import currencyMask from './currencyMask';
import percentMask from './percentMask';
import phoneMask from './phoneMask';
import zipcodeMask from './zipcodeMask';

const masks = {
  currencyValue: currencyMask,
  percentValue: percentMask,
  phone: phoneMask,
  zipcode: zipcodeMask
};

type Props = {
  field: ControllerRenderProps;
  placeholder: string;
  name: string;
  mask: 'currencyValue' | 'percentValue' | 'phone' | 'zipcode';
};

export const InputMasked = forwardRef<HTMLInputElement, Props>(({ field, placeholder, name, mask, ...props }, ref) => {
  const form = useFormContext();
  const inputRef = useMaskito({ options: masks[mask] });

  let value = field.value || '';

  if (mask === 'currencyValue' && value) {
    value = maskitoTransform(insertDot(onlyNumbers(value.toString())).toFixed(2), masks[mask]);
  }

  if (mask === 'percentValue' && value) {
    value = maskitoTransform(value.toString(), masks[mask]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue: string | number = e.target.value;
    if (mask === 'currencyValue' || mask === 'percentValue') {
      newValue = onlyNumbers(newValue);
    }
    field.onChange(newValue);
  }

  return (
    <Input
      type="tel"
      placeholder={placeholder}
      {...field}
      onInput={handleChange}
      ref={(node) => {
        inputRef(node);
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      }}
      {...props}
      value={value}
    />
  );
});

InputMasked.displayName = 'InputMasked';
