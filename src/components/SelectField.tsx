import { SelectProps } from '@radix-ui/react-select';
import React, { forwardRef, useEffect } from 'react';
import { ControllerRenderProps, FieldValues, UseFormReturn } from 'react-hook-form';

import { withFormControl } from '@/hoc/withFormControl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SelectFieldProps = SelectProps & {
  options: { key: string; value: string; name: string }[];
  name: string;
  placeholder: string;
  label?: string;
};

type Props = {
  field: ControllerRenderProps<FieldValues, string>;
  form: UseFormReturn;
};

const SelectField = forwardRef<HTMLDivElement, Props & SelectFieldProps>(
  ({ options, name, placeholder, form, field, defaultValue, ...props }, ref) => {
    useEffect(() => {
      if (defaultValue) {
        field.onChange(defaultValue);
      }
    }, [defaultValue, field]);

    function onValueChange(data: string) {
      field.onChange(data);
      if (props.onValueChange) {
        props.onValueChange(data);
      }
    }

    return (
      <Select {...props} value={form.watch(name)} onValueChange={onValueChange}>
        <SelectTrigger className={`${!form.getValues(name) && 'text-slate-500'}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent ref={ref}>
          <SelectGroup>
            {options.map((d) => (
              <SelectItem key={d.key} value={d.value}>
                {d.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

export default withFormControl<SelectFieldProps>(SelectField);
