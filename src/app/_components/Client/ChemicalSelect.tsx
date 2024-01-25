import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function ChemicalSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Chemical type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="chemical_1">chemical_1</SelectItem>
          <SelectItem value="chemical_2">chemical_2</SelectItem>
          <SelectItem value="chemical_3">chemical_3</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
