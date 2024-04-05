import { useMaskito } from '@maskito/react';
import { Input } from '../ui/input';
import currencyMask from './currencyMask';
import percentMask from './percentMask';
import phoneMask from './phoneMask';
import React from 'react';

const masks = {
  currencyValue: currencyMask,
  percentValue: percentMask,
  phone: phoneMask
};

type Props = {
  field: any;
  placeholder: string;
  name: string;
  form: any;
  mask: 'currencyValue' | 'percentValue' | 'phone';
};

export const InputMasked = React.forwardRef(
  ({ field, placeholder, name, form, mask, ...props }: Props) => {
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
  }
);
