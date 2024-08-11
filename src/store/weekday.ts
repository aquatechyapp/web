import { format } from 'date-fns';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WeekdaysUppercase } from '@/interfaces/Weekday';

type Store = {
  selectedWeekday: WeekdaysUppercase;
};
type Actions = {
  setSelectedWeekday: (weekday: WeekdaysUppercase) => void;
};

export const useWeekdayStore = create<Store & Actions>()(
  devtools((set) => ({
    selectedWeekday: format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase,
    setSelectedWeekday: (weekday: WeekdaysUppercase) => set({ selectedWeekday: weekday })
  }))
);
