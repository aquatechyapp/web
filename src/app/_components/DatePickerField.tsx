import { DatePicker } from '@/app/_components/ui/date-picker';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/app/_components/ui/form';
import { Label } from '@/app/_components/ui/label';

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
            <Label>{placeholder}</Label>
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
