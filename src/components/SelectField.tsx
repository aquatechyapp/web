import { SelectProps } from '@radix-ui/react-select';
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Label } from './ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Props = {
  data: { key: string; value: string; name: string }[];
  // props for select html
  form: UseFormReturn<any>;
  name: string;
  placeholder: string;
  label?: string;
  props?: React.HTMLProps<HTMLSelectElement>;
};

export default function SelectField({ data, form, name, placeholder, label, ...props }: Props & SelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <Label>{label}</Label>
            <FormControl>
              <Select defaultValue={form.watch(name)} onValueChange={field.onChange} {...props}>
                <SelectTrigger className={`${!form.getValues(name) && 'text-slate-500'}`}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data.map((d) => (
                      <SelectItem key={d.key} value={d.value}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
