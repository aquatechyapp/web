'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function DropdownMenuCheckboxes({ onChange }) {
  const [weekdays, setWeekdays] = React.useState([
    { selected: false, value: 'SUNDAY', label: 'Sunday' },
    { selected: false, value: 'MONDAY', label: 'Monday' },
    { selected: false, value: 'TUESDAY', label: 'Tuesday' },
    { selected: false, value: 'WEDNESDAY', label: 'Wednesday' },
    { selected: false, value: 'THURSDAY', label: 'Thursday' },
    { selected: false, value: 'FRIDAY', label: 'Friday' },
    { selected: false, value: 'SATURDAY', label: 'Saturday' }
  ]);

  React.useEffect(() => {
    onChange(
      weekdays.filter((day) => day.selected === true).map((day) => day.value)
    );
  }, [weekdays]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full ">
          {/* {weekdays.some((day) => day.selected === true) ? (
            <div className="text-sm flex flex-col flex-wrap">
              {weekdays
                .filter((day) => day.selected === true)
                .map((day) => day.value)
                .join(', ')}
            </div>
          ) : (
            'Weekdays'
          )} */}
          Weekdays
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {weekdays.map((day) => (
          <DropdownMenuCheckboxItem
            key={day.value}
            checked={day.selected}
            onCheckedChange={(checked) =>
              setWeekdays((prev) =>
                prev.map((prevDay) =>
                  prevDay.value === day.value
                    ? { ...prevDay, selected: checked }
                    : prevDay
                )
              )
            }
          >
            {day.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
