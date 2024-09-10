import { ControllerRenderProps, useFormContext } from 'react-hook-form';

import { FieldType } from '@/ts/enums/enums';

import { InputMasked } from './InputMasked';
import { Checkbox } from './ui/checkbox';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

type MaskTypes = 'currencyValue' | 'percentValue' | 'phone';

type Props = {
  className?: string;
  disabled?: boolean;
  name: string;
  placeholder?: string;
  type?: FieldType;
  props?: React.HTMLProps<HTMLInputElement>;
  label?: string;
};

export default function InputField({ name, placeholder, type = FieldType.Default, label, ...props }: Props) {
  const form = useFormContext();
  const types = {
    zip: {
      component: (field: ControllerRenderProps) => (
        <InputMasked mask="zipcode" field={field} placeholder={placeholder || ''} {...field} {...props} />
      )
    },
    phone: {
      component: (field: ControllerRenderProps) => {
        return <InputMasked mask="phone" field={field} placeholder={placeholder || ''} {...field} {...props} />;
      }
    },
    password: {
      component: (field: ControllerRenderProps) => (
        <Input
          type="password"
          placeholder={placeholder}
          {...field}
          onChange={(e) => {
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
          onChange={(e) => {
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
          onChange={(e) => {
            form.setValue(field.name, e.target.value);
          }}
        />
      )
    },
    checkbox: {
      component: (field: ControllerRenderProps) => (
        <div className="inline-flex items-start justify-start gap-2 self-stretch">
          <Checkbox
            {...field}
            {...props}
            checked={!!field.value}
            id={name}
            onCheckedChange={() => field.onChange(!field.value)}
          />
          <Label htmlFor={name} className="text-sm font-semibold leading-none text-gray-400">
            {placeholder}
          </Label>
        </div>
      )
    },
    percentValue: {
      component: (field: ControllerRenderProps) => (
        <InputMasked mask={type as MaskTypes} field={field} placeholder={placeholder || ''} {...field} {...props} />
      )
    },
    currencyValue: {
      component: (field: ControllerRenderProps) => (
        <InputMasked mask={type as MaskTypes} field={field} placeholder={placeholder || ''} {...field} {...props} />
      )
    },
    switch: {
      component: (field: ControllerRenderProps) => (
        <Switch {...props} checked={field.value} onCheckedChange={field.onChange} />
      )
    }
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex h-full w-full flex-col gap-2">
            {!['checkbox'].includes(type) && label ? <Label className="text-nowrap">{label}</Label> : null}
            <FormControl>{types[type as keyof typeof types].component(field)}</FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
