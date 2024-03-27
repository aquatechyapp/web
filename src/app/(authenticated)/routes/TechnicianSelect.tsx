import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/_components/ui/select';
import { useTechniciansContext } from '@/context/technicians';
import { WorkRelation } from '@/interfaces/User';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function TechnicianSelect({ onChange }: Props) {
  const { assignmentToId, setAssignmentToId, technicians } =
    useTechniciansContext();

  function handleChange(technicianId: string) {
    setAssignmentToId(technicianId);
    onChange(technicianId);
  }

  return (
    <div className="mt-2">
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Select onValueChange={handleChange} defaultValue={assignmentToId}>
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
