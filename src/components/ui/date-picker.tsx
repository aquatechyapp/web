'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Matcher } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type Props = {
  placeholder: string;
  onChange: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
};

export function DatePicker({ placeholder, onChange, disabled }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  function handleChange(date: Date | undefined) {
    setDate(date);
    setIsPopoverOpen(false);
  }

  useEffect(() => {
    onChange(date);
  }, [date]);

  return (
    <Popover modal open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
        <Calendar disabled={disabled} mode="single" selected={date} onSelect={handleChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
