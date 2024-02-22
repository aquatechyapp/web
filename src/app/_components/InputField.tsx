import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MaskitoOptions } from '@maskito/core';

import { useMaskito } from '@maskito/react';
import { PhoneMask, Weekdays } from '../../constants';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenuCheckboxes } from '@/components/ui/multiple-select';
import { Label } from '@/components/ui/label';

type Props = {
  form: any;
  name: string;
  placeholder?: string;
  type?:
    | 'checkbox'
    | 'phone'
    | 'password'
    | 'default'
    | 'textArea'
    | 'file'
    | 'sameBillingAddress'
    | 'weekdays';
  props?: any;
};

export default function InputField({
  form,
  name,
  placeholder,
  type = 'default',
  ...props
}: Props) {
  const digitsOnlyMask: MaskitoOptions = {
    mask: PhoneMask
  };
  const inputRef = useMaskito({ options: digitsOnlyMask });

  const types = {
    phone: {
      component: (field) => (
        <Input
          type="tel"
          placeholder={placeholder}
          {...field}
          ref={inputRef}
          onInput={(e) => {
            form.setValue(name, e.target.value);
          }}
        />
      )
    },
    password: {
      component: (field) => (
        <Input
          type="password"
          placeholder={placeholder}
          {...field}
          onInput={(e) => {
            form.setValue(name, e.target.value);
          }}
        />
      )
    },
    default: {
      component: (field) => (
        <Input
          type="text"
          placeholder={placeholder}
          {...field}
          onInput={(e) => {
            form.setValue(name, e.target.value);
          }}
        />
      )
    },
    textArea: {
      component: (field) => (
        <Textarea
          type="text"
          placeholder={placeholder}
          {...props}
          {...field}
          onInput={(e) => {
            form.setValue(field.name, e.target.value);
          }}
        />
      )
    },
    file: {
      component: (field) => (
        <Input
          accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
          type="file"
          onChange={(e) =>
            field.onChange(e.target.files ? e.target.files[0] : null)
          }
        />
      )
    },
    checkbox: {
      component: (field) => (
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <Checkbox
            {...field}
            {...props}
            id={name}
            onCheckedChange={() => field.onChange(!field.value)}
          />
          <Label
            htmlFor={name}
            className="text-sm font-medium font-semibold leading-none text-gray-400"
          >
            {placeholder}
          </Label>
        </div>
      )
    },
    weekdays: {
      component: (field) => (
        <DropdownMenuCheckboxes
          onChange={(weekdays) => field.onChange(weekdays)}
        />
      )
    }
  };
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <FormControl>{types[type].component(field)}</FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// {name === 'phone' ? (
//   <Input
//     type="tel"
//     placeholder={placeholder}
//     {...field}
//     ref={inputRef}
//     onInput={(e) => {
//       form.setValue('phone', e.target.value);
//     }}
//   />
// ) : (
//   <Input
//     type={name === 'confirmPassword' ? 'password' : name}
//     placeholder={placeholder}
//     {...field}
//   />
// )}
