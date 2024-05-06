import { useMaskito } from '@maskito/react';
import React from 'react';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

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

export const InputMasked = ({
  field,
  placeholder,
  name,
  form,
  mask,
  ...props
}: Props) => {
  const inputRef = useMaskito({ options: masks[mask] });

  return (
    <Input
      type="tel"
      placeholder={placeholder}
      {...field}
      onInput={(e) => {
        form.setValue(name, e.target.value);
      }}
      ref={inputRef}
      {...props}
    />
  );
};
