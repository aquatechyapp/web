import { format } from 'date-fns';
import { createContext, useContext, useState } from 'react';

import { WeekdaysUppercase } from '@/interfaces/Weekday';

type WeekdayContextType = {
  selectedWeekday: WeekdaysUppercase | '';
  setSelectedWeekday: (weekday: WeekdaysUppercase) => void;
};

const WeekdayContext = createContext<WeekdayContextType>({
  selectedWeekday: '',
  setSelectedWeekday: () => {}
});

export const WeekdayProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedWeekday, setSelectedWeekday] = useState(format(new Date(), 'EEEE').toUpperCase() as WeekdaysUppercase);

  return (
    <WeekdayContext.Provider
      value={{
        selectedWeekday,
        setSelectedWeekday
      }}
    >
      {children}
    </WeekdayContext.Provider>
  );
};

export const useWeekdayContext = () => useContext(WeekdayContext);
