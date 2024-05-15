import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Props = {
  data: { key: string; value: string; name: string }[];
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
};

export function FilterSelect({ data, placeholder, onChange, value }: Props) {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="w-auto">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent defaultValue={value}>
        <SelectGroup>
          {[
            {
              key: 'All',
              value: 'All',
              name: 'All'
            },
            ...data
          ].map((d) => (
            <SelectItem key={d.key} value={d.value}>
              {d.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
