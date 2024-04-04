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
  restrictOnlySelectedDay?: boolean;
};

export default function DatePickerField({
  form,
  name,
  placeholder,
  restrictOnlySelectedDay = false
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full flex flex-col">
            <Label>{placeholder}</Label>
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
