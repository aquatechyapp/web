import { DatePicker } from './ui/date-picker';
import { FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Label } from './ui/label';

type Props = {
  props?: any;
  form: any;
  name: string;
  placeholder: string;
  label: string;
  restrictOnlySelectedDay?: boolean;
};

export default function DatePickerField({ form, name, placeholder, label, restrictOnlySelectedDay = false }: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex w-full flex-col">
            <Label>{label}</Label>
            <FormControl>
              <DatePicker
                placeholder={placeholder}
                onChange={field.onChange}
                restrictOnlySelectedDay={restrictOnlySelectedDay}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
