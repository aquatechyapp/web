import { useQuery, useQueryClient } from '@tanstack/react-query';
import { differenceInWeeks, getDay, isAfter, isSameDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

import { useMembersStore } from '@/store/members';
import { useWeekdayStore } from '@/store/weekday';
import { Frequency } from '@/ts/enums/enums';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { clientAxios } from '../lib/clientAxios';
import { Assignment } from '../ts/interfaces/Assignments';

function filterAssignmentsByWeekday(assignments: Assignment[], selectedWeekday: string): Assignment[] {
  return assignments.filter((assignment) => {
    if (assignment.weekday.toUpperCase() === selectedWeekday.toUpperCase()) {
      return true;
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

  const assignmentToId = useMembersStore((state) => state.assignmentToId);
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
      current: filterAssignmentsByWeekday(filteredAssignments, selectedWeekday)
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
