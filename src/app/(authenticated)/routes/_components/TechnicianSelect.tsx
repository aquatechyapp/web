import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const techs = ['John', 'Doe'];
export default function TechnicianSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Technician..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {techs.map((tech) => (
            <SelectItem value={tech}>{tech}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
