import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/_components/ui/select';

export default function TechnicianSelect({
  technicians,
  onChange,
  defaultValue
}) {
  return (
    <div className="mt-2">
      <Select onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Technician..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {technicians.map((technician) => (
              <SelectItem
                key={technician.subcontractor.id}
                value={technician.subcontractor.id}
              >
                {technician.subcontractor.firstName}{' '}
                {technician.subcontractor.lastName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
