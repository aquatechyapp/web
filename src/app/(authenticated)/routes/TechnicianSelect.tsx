import { useShallow } from 'zustand/react/shallow';

import { useTechniciansStore } from '@/store/technicians';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { WorkRelation } from '../../../interfaces/User';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function TechnicianSelect({ onChange }: Props) {
  const { assignmentToId, technicians } = useTechniciansStore(
    useShallow((state) => ({
      assignmentToId: state.assignmentToId,
      technicians: state.technicians
    }))
  );

  function handleChange(technicianId: string) {
    onChange(technicianId);
  }

  return (
    <div className="mt-2">
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Select onValueChange={handleChange} defaultValue={assignmentToId}>
        <SelectTrigger data-testid="select-technician">
          <SelectValue placeholder="Technician..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {technicians.map((technician: WorkRelation) => (
              <SelectItem key={technician.subcontractorId} value={technician.subcontractorId}>
                {technician.subcontractor.firstName} {technician.subcontractor.lastName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
