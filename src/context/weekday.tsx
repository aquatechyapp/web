import { createContext, useContext, useState } from 'react';
import { format } from 'date-fns';

type Weekdays =
  | 'SUNDAY'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY';

type WeekdayContextType = {
  selectedWeekday: Weekdays | '';
  setSelectedWeekday: (weekday: Weekdays) => void;
};

const WeekdayContext = createContext<WeekdayContextType>({
  selectedWeekday: '',
  setSelectedWeekday: () => {}
});

export const WeekdayProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [selectedWeekday, setSelectedWeekday] = useState(
    format(new Date(), 'EEEE').toUpperCase() as Weekdays
  );

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
