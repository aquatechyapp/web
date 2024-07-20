import { WeekdaysUppercase } from '@/interfaces/Weekday';
import { useWeekdayStore } from '@/store/weekday';

// Return an array of disabled weekdays based on the selected weekday
// This is a business logic, startOn should match weekday with endAfter
// Ex.: startOn => friday, endAfter should be a friday

export function useDisabledWeekdays(customSelectedWeekday?: WeekdaysUppercase) {
  let { selectedWeekday } = useWeekdayStore();
  if (customSelectedWeekday) {
    selectedWeekday = customSelectedWeekday;
  }

  const disabledWeekdays = [0, 1, 2, 3, 4, 5, 6];
  let selectedWeekdayIndex = 0;

  switch (selectedWeekday) {
    case 'SUNDAY':
      selectedWeekdayIndex = 0;
      break;
    case 'MONDAY':
      selectedWeekdayIndex = 1;
      break;
    case 'TUESDAY':
      selectedWeekdayIndex = 2;
      break;
    case 'WEDNESDAY':
      selectedWeekdayIndex = 3;
      break;
    case 'THURSDAY':
      selectedWeekdayIndex = 4;
      break;
    case 'FRIDAY':
      selectedWeekdayIndex = 5;
      break;
    case 'SATURDAY':
      selectedWeekdayIndex = 6;
      break;
  }

  disabledWeekdays.splice(selectedWeekdayIndex, 1);

  return disabledWeekdays;
}
