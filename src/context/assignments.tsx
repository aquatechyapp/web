import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInWeeks, isAfter, isSameDay, startOfDay } from 'date-fns';
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

import { useTechniciansStore } from '@/store/technicians';
import { useWeekdayStore } from '@/store/weekday';
import { Frequency } from '@/ts/enums/enums';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { clientAxios } from '../lib/clientAxios';
import { Assignment } from '../ts/interfaces/Assignments';

function filterAssignmentsByFrequency(assignments: Assignment[], selectedDay: Date): Assignment[] {
  return assignments.filter((assignment) => {
    const startOn = startOfDay(new Date(assignment.startOn));
    const endAfter = startOfDay(new Date(assignment.endAfter));
    const weeksBetween = differenceInWeeks(selectedDay, startOn);

    if (isAfter(selectedDay, endAfter)) {
      return false;
    }

    switch (assignment.frequency) {
      case Frequency.WEEKLY:
        return isSameDay(startOn, selectedDay) || (selectedDay > startOn && selectedDay.getDay() === startOn.getDay());
      case Frequency.E2WEEKS:
        return (
          isSameDay(startOn, selectedDay) ||
          (selectedDay > startOn && selectedDay.getDay() === startOn.getDay() && weeksBetween % 2 === 0)
        );
      case Frequency.E3WEEKS:
        return (
          isSameDay(startOn, selectedDay) ||
          (selectedDay > startOn && selectedDay.getDay() === startOn.getDay() && weeksBetween % 3 === 0)
        );
      case Frequency.E4WEEKS:
        return (
          isSameDay(startOn, selectedDay) ||
          (selectedDay > startOn && selectedDay.getDay() === startOn.getDay() && weeksBetween % 4 === 0)
        );
      default:
        return false;
    }
  });
}

type AssignmentsContextType = {
  assignments: {
    initial: Assignment[];
    current: Assignment[];
  };
  setAssignments: ({ initial, current }: { initial: Assignment[]; current: Assignment[] }) => void;
  allAssignments: Assignment[];
};

const AssignmentsContext = createContext<AssignmentsContextType>({
  assignments: {
    initial: [],
    current: []
  },
  setAssignments: () => {},
  allAssignments: []
});

export const AssignmentsProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const assignmentToId = useTechniciansStore((state) => state.assignmentToId);
  const { selectedWeekday, selectedDay } = useWeekdayStore((state) => state);
  const userId = Cookies.get('userId');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments', userId],
    queryFn: async () => {
      if (!userId) {
        queryClient.cancelQueries({ queryKey: ['assignments'] });
        return [];
      }
      const response = await clientAxios.get('/assignments');
      return response.data;
    },
    staleTime: 1000 * 60 * 60
  });

  const [assignments, setAssignments] = useState({
    initial: data || [],
    current: [] as Assignment[]
  });

  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (!userId) return;
    if (isError || isLoading) return;

    const filteredAssignments = data.assignments
      ?.filter((assignment: Assignment) => assignment.assignmentToId === assignmentToId)
      .sort((a: Assignment, b: Assignment) => a.order - b.order);

    setAssignments({
      initial: [...filteredAssignments],
      current: filterAssignmentsByFrequency(filteredAssignments, new Date(selectedDay))
    });
    setAllAssignments(data.assignments);
  }, [data, isError, isLoading, selectedWeekday, assignmentToId, userId, selectedDay]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <AssignmentsContext.Provider
      value={{
        assignments,
        setAssignments,
        allAssignments
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
};

export const useAssignmentsContext = () => useContext(AssignmentsContext);
