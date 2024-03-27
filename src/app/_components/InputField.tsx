import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';

import { Textarea } from '@/app/_components/ui/textarea';
import { Checkbox } from '@/app/_components/ui/checkbox';
import { DropdownMenuCheckboxes } from '@/app/_components/ui/multiple-select';
import { Label } from '@/app/_components/ui/label';
import { InputMasked } from './InputMasked';

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
    | 'weekdays'
    | 'zip'
    | 'percentValue'
    | 'currencyValue';
  props?: any;
  label?: string;
};

export default function InputField({
  form,
  name,
  placeholder,
  type = 'default',
  label,
  ...props
}: Props) {
  const types = {
    zip: {
      component: (field) => (
        <Input
          placeholder={placeholder}
          type="tel"
          {...field}
          onInput={(e) => {
            form.setValue(name, e.target.value);
          }}
          {...props}
        />
      )
    },
    phone: {
      component: (field) => {
        return (
          <InputMasked
            mask="phone"
            field={field}
            placeholder={placeholder}
            name={name}
            form={form}
            {...field}
            {...props}
          />
        );
      }
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
          {...props}
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
    },
    percentValue: {
      component: (field) => (
        <InputMasked
          mask={type}
          field={field}
          placeholder={placeholder}
          name={name}
          form={form}
          {...field}
          {...props}
        />
      )
    },
    currencyValue: {
      component: (field) => (
        <InputMasked
          mask={type}
          field={field}
          placeholder={placeholder}
          name={name}
          form={form}
          {...field}
          {...props}
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
          <FormItem className="w-full h-full">
            {!['checkbox'].includes(type) && (
              <Label>{label || placeholder}</Label>
            )}
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
