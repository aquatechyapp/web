import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/_components/ui/select';
import { WorkRelation } from '@/interfaces/User';

type Props = {
  technicians: WorkRelation[];
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function TechnicianSelect({
  technicians,
  onChange,
  defaultValue
}: Props) {
  return (
    <div className="mt-2">
      <Select onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Technician..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {technicians.map((technician: WorkRelation) => (
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
