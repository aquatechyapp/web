import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';

import { InputMasked } from './InputMasked';
import { Checkbox } from './ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { DropdownMenuCheckboxes } from './ui/multiple-select';
import { Textarea } from './ui/textarea';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
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
  props?: React.HTMLProps<HTMLInputElement>;
  label?: string;
};

export default function InputField({ form, name, placeholder, type = 'default', label, ...props }: Props) {
  const types = {
    zip: {
      component: (field: ControllerRenderProps) => (
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
      component: (field: ControllerRenderProps) => {
        return (
          <InputMasked mask="phone" field={field} placeholder={placeholder || ''} form={form} {...field} {...props} />
        );
      }
    },
    password: {
      component: (field: ControllerRenderProps) => (
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
      component: (field: ControllerRenderProps) => (
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
      component: (field: ControllerRenderProps) => (
        <Textarea
          placeholder={placeholder}
          {...props}
          {...field}
          style={{ marginTop: 0 }}
          onInput={(e) => {
            form.setValue(field.name, e.target.value);
          }}
        />
      )
    },
    checkbox: {
      component: (field: ControllerRenderProps) => (
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <Checkbox {...field} {...props} id={name} onCheckedChange={() => field.onChange(!field.value)} />
          <Label htmlFor={name} className="text-sm font-semibold leading-none text-gray-400">
            {placeholder}
          </Label>
        </div>
      )
    },
    weekdays: {
      component: (field: ControllerRenderProps) => (
        <DropdownMenuCheckboxes onChange={(weekdays) => field.onChange(weekdays)} />
      )
    },
    percentValue: {
      component: (field: ControllerRenderProps) => (
        <InputMasked mask={type} field={field} placeholder={placeholder || ''} form={form} {...field} {...props} />
      )
    },
    currencyValue: {
      component: (field: ControllerRenderProps) => (
        <InputMasked mask={type} field={field} placeholder={placeholder || ''} form={form} {...field} {...props} />
      )
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="h-full w-full">
            {!['checkbox'].includes(type) && <Label className="text-nowrap">{label || placeholder}</Label>}
            <FormControl>{types[type].component(field)}</FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
