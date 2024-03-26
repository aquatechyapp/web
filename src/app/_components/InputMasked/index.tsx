import { useMaskito } from '@maskito/react';
import { Input } from '../ui/input';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import currencyMask from './currencyMask';
import percentMask from './percentMask';

const masks = {
  currencyValue: currencyMask,
  percentValue: percentMask
};

export const InputMasked = ({
  field,
  placeholder,
  name,
  form,
  mask,
  ...props
}) => {
  const inputRef = useMaskito({ options: masks[mask] });

  return (
    <Input
      type="tel"
      placeholder={placeholder}
      {...field}
      onInput={(e) => {
        form.setValue(name, e.target.value);
      }}
      {...props}
      ref={inputRef}
    />
  );
};
