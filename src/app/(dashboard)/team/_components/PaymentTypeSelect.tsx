import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function PaymentTypeSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Payment type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="fixed_by_pool">Fixed value by pool</SelectItem>
          <SelectItem value="percent_by_pool">% fixed by pool</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
