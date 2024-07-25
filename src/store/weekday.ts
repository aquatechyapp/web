import { format } from 'date-fns';
import { create } from 'zustand';

import { WeekdaysUppercase } from '@/interfaces/Weekday';

type WeekdayState = {
  selectedWeekday: WeekdaysUppercase;
  setSelectedWeekday: (weekday: WeekdaysUppercase) => void;
};

export const useWeekdayStore = create<WeekdayState>((set) => ({
  selectedWeekday: format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase,
  setSelectedWeekday: (weekday: WeekdaysUppercase) => set({ selectedWeekday: weekday })
}));
