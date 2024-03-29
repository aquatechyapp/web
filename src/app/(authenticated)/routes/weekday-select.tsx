import { Label } from '@/app/_components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/_components/ui/select';
import { Weekdays } from '@/constants';
import { useWeekdayContext } from '@/context/weekday';
import { WeekdaysSelect } from '@/interfaces/Weekday';

type Props = {
  onChange: (value: string) => void;
  defaultValue?: string;
};

export default function WeekdaySelect({ onChange }: Props) {
  const { selectedWeekday } = useWeekdayContext();

  return (
    <div>
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Label>Weekday</Label>
      <Select onValueChange={onChange} defaultValue={selectedWeekday}>
        <SelectTrigger>
          <SelectValue placeholder="Technician..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {Weekdays.map((weekday: WeekdaysSelect) => (
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
