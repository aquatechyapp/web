import { Weekdays } from './RoutesList';

const weekdays: Weekdays[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const NavWeekdayItem = ({
  weekday,
  isActive
}: {
  weekday: Weekdays;
  isActive: boolean;
}) => {
  return (
    <div
      className={`flex h-8 w-14 shrink grow basis-0 items-center justify-center gap-2 rounded-md ${isActive ? 'bg-gray-100' : ''} px-3 py-1.5`}
    >
      <div
        className={`text-sm font-semibold leading-tight tracking-tight ${isActive ? 'text-neutral-800' : 'text-zinc-500'}`}
      >
        {weekday.slice(0, 3)}
      </div>
    </div>
  );
};

type Props = {
  selectedWeekday: Weekdays;
  setSelectedWeekday: (weekday: Weekdays) => void;
};
export function WeekdaysNav({ selectedWeekday, setSelectedWeekday }: Props) {
  return (
    <div className="inline-flex items-start justify-start self-stretch rounded-lg border border-zinc-200 bg-white p-1">
      {weekdays.map((weekday) => (
        <div
          onClick={() => setSelectedWeekday(weekday)}
          className="hover:cursor-pointer"
        >
          <NavWeekdayItem
            weekday={weekday}
            isActive={weekday === selectedWeekday}
            key={weekday}
          />
        </div>
      ))}
    </div>
  );
}
