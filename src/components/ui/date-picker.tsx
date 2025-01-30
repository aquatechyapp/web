'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Component, ComponentProps, useState } from 'react';
import { Matcher } from 'react-day-picker';

import { cn } from '../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type Props = {
  placeholder: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[];
  className?: ComponentProps<'div'>['className'];
};

export function DatePicker({ className, placeholder, onChange, disabled, value = new Date() }: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  function handleChange(date: Date | undefined) {
    onChange(date);
    setIsPopoverOpen(false);
  }

  return (
    <Popover modal open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-fit shrink-0 justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar disabled={disabled} mode="single" selected={value} onSelect={handleChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
