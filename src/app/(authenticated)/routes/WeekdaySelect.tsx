import { SelectOption } from '@/interfaces/Others';

import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../components/ui/select';
import { Weekdays } from '../../../constants';
import { WeekdaysUppercase } from '../../../interfaces/Weekday';

type Props = {
  onChange: (value: WeekdaysUppercase) => void;
  value: WeekdaysUppercase;
};

export default function WeekdaySelect({ onChange, value }: Props) {
  return (
    <div>
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Label>Weekday</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger data-testid="select-weekday" className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Weekdays.map((weekday: SelectOption) => (
              <SelectItem key={weekday.value} value={weekday.value}>
                {weekday.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
