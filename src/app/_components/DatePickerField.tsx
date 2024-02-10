import { DatePicker } from '@/components/ui/date-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';

type Props = {
  props?: any;
  form: any;
  name: string;
  placeholder: string;
};

export default function DatePickerField({ form, name, placeholder }: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <FormControl>
              <DatePicker placeholder={placeholder} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
