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
import { WeekdaysSelect } from '../../../interfaces/Weekday';

type Props = {
  onChange: (value: string) => void;
  value: string;
};

export default function WeekdaySelect({ onChange, value }: Props) {
  return (
    <div>
      {/* por padrão, o User logado é o tecnico selecionado */}
      <Label>Weekday</Label>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="mt-2">
          <SelectValue />
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
