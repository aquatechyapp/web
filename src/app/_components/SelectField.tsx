import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

type Props = {
  data: { key: string; value: string; name: string }[];
  props?: any;
  form: any;
  name: string;
  placeholder: string;
};

export default function SelectField({
  data,
  form,
  name,
  placeholder,
  ...props
}: Props) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="w-full">
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
