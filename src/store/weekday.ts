import { format, startOfDay } from 'date-fns';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WeekdaysUppercase } from '@/ts/interfaces/Weekday';

type Store = {
  selectedWeekday: WeekdaysUppercase;
  selectedDay: string;
};
type Actions = {
  setSelectedWeekday: (weekday: WeekdaysUppercase) => void;
  setSelectedDay: (day: string) => void;
};

export const useWeekdayStore = create<Store & Actions>()(
  devtools((set) => ({
    selectedWeekday: format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase,
    selectedDay: new Date().toISOString(),
    setSelectedWeekday: (weekday: WeekdaysUppercase) => set({ selectedWeekday: weekday }),
    setSelectedDay: (day: string) => set({ selectedDay: day })
  }))
);
