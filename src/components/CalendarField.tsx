import { Calendar } from './ui/calendar';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Label } from './ui/label';

type Props = {
  props?: any;
  form: any;
  name: string;
  placeholder: string;
  disabledWeekdays?: number[];
};

export default function CalendarField({ form, name, placeholder, disabledWeekdays }: Props) {
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
