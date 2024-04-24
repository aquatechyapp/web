'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useWeekdayContext } from '../../context/weekday';

type Props = {
  placeholder: string;
  onChange: (date: Date) => void;
  restrictOnlySelectedDay?: boolean;
};

export function DatePicker({
  placeholder,
  onChange,
  restrictOnlySelectedDay = false
}: Props) {
  const [date, setDate] = React.useState<Date>();
  const { selectedWeekday } = useWeekdayContext();

  const disabledWeekdays = [0, 1, 2, 3, 4, 5, 6];
  let selectedWeekdayIndex = 0;

  switch (selectedWeekday) {
    case 'SUNDAY':
      selectedWeekdayIndex = 0;
      break;
    case 'MONDAY':
      selectedWeekdayIndex = 1;
      break;
    case 'TUESDAY':
      selectedWeekdayIndex = 2;
      break;
    case 'WEDNESDAY':
      selectedWeekdayIndex = 3;
      break;
    case 'THURSDAY':
      selectedWeekdayIndex = 4;
      break;
    case 'FRIDAY':
      selectedWeekdayIndex = 5;
      break;
    case 'SATURDAY':
      selectedWeekdayIndex = 6;
      break;
  }

  disabledWeekdays.splice(selectedWeekdayIndex, 1);

  React.useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          disabled={{
            dayOfWeek: restrictOnlySelectedDay ? disabledWeekdays : []
          }}
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
