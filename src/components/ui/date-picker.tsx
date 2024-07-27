'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type Props = {
  placeholder: string;
  onChange: (date: Date | undefined) => void;
  disabledWeekdays?: number[];
};

export function DatePicker({ placeholder, onChange, disabledWeekdays }: Props) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    onChange(date);
  }, [date]);

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar disabledWeekdays={disabledWeekdays} mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
