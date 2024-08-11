import { useFormContext } from 'react-hook-form';

import { Calendar } from './ui/calendar';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Label } from './ui/label';

type Props = {
  name: string;
  placeholder: string;
  disabledWeekdays?: number[];
};

export default function CalendarField({ name, placeholder, disabledWeekdays }: Props) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col">
            <Label>{placeholder}</Label>
            <FormControl>
              <Calendar
                disabledWeekdays={disabledWeekdays ?? []}
                {...field}
                selected={field.value}
                mode="single"
                onSelect={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
