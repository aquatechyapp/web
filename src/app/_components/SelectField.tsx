import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/app/_components/ui/form';
import { Label } from '@/app/_components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/_components/ui/select';

type Props = {
  data: { key: string; value: string; name: string }[];
  props?: any;
  form: any;
  name: string;
  placeholder: string;
  label?: string;
};

export default function SelectField({
  data,
  form,
  name,
  placeholder,
  label,
  ...props
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
            <Label>{label || placeholder}</Label>
            <FormControl>
              <Select onValueChange={field.onChange} {...props}>
                <SelectTrigger
                  className={`${!form.getValues(name) && 'text-slate-500'}`}
                >
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
