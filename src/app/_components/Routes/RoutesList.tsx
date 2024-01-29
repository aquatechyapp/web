'use client';

import { format } from 'date-fns';
import { useState } from 'react';
import { WeekdaysNav } from './WeekdaysNav';
import TechnicianSelect from './TechnicianSelect';
import Link from 'next/link';

export type Weekdays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

const routes = [
  {
    image: 'https://via.placeholder.com/44x44',
    name: 'Route 1',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  },
  {
    image: 'https://via.placeholder.com/44x44',
    name: 'Route 2',
    address: '1600 Amphitheatre Parkway, Mountain View, california.'
  }
];

function RouteItem({ image, name, address }) {
  return (
    <div className="inline-flex items-center justify-start self-stretch border-b border-gray-100">
      <div className="flex h-[60px] shrink grow basis-0 items-center justify-start gap-2 border-b border-gray-100 bg-white px-1 py-2">
        <div className="flex items-center justify-start gap-2">
          <img
            className="h-11 w-11 rounded-lg"
            src="https://via.placeholder.com/44x44"
          />
          <div className="inline-flex flex-col items-start justify-center gap-1">
            <div className="text-sm font-medium leading-tight tracking-tight text-neutral-800">
              {name}
            </div>
            <div className="text-xs font-normal leading-[18px] tracking-tight text-gray-500">
              {address}
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-8 w-8 items-center justify-center gap-1 rounded-lg border border-gray-100 p-1.5">
        <div className="shrink grow basis-0 text-center text-sm font-semibold leading-tight tracking-tight text-neutral-800">
          1
        </div>
      </div>
    </div>
  );
}
export function RoutesList() {
  const currentWeekday = format(new Date(2020, 1, 10), 'EEEE') as Weekdays;
  const [selectedWeekday, setSelectedWeekday] =
    useState<Weekdays>(currentWeekday);

  return (
    <div className="inline-flex flex-col items-center justify-start gap-3.5 rounded-lg border border-zinc-200 bg-white p-6">
      <WeekdaysNav
        selectedWeekday={selectedWeekday}
        setSelectedWeekday={setSelectedWeekday}
      />
      <div className="flex h-10 flex-col items-start justify-start gap-1 self-stretch">
        <TechnicianSelect />
      </div>
      {routes.map((route) => (
        <RouteItem
          address={route.address}
          image={route.image}
          name={route.name}
          key={route.name}
        />
      ))}
    </div>
  );
}
