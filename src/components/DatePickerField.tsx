import { useFormContext } from 'react-hook-form';

import { DatePicker } from './ui/date-picker';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Label } from './ui/label';

type Props = {
  name: string;
  placeholder: string;
  restrictOnlySelectedDay?: boolean;
  label?: string;
  disabledWeekdays?: number[];
};

export default function DatePickerField({ name, placeholder, label, disabledWeekdays }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useFormContext<any>();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col">
            <Label>{label}</Label>
            <FormControl>
              <DatePicker disabledWeekdays={disabledWeekdays} placeholder={placeholder} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
