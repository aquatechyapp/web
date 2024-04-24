import { createContext, useContext, useEffect, useState } from 'react';
import { useTechniciansContext } from './technicians';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientAxios } from '../lib/clientAxios';
import { useWeekdayContext } from './weekday';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Cookies from 'js-cookie';
import { Assignment } from '../interfaces/Assignments';

type AssignmentsContextType = {
  assignments: {
    initial: Assignment[];
    current: Assignment[];
  };
  setAssignments: ({
    initial,
    current
  }: {
    initial: Assignment[];
    current: Assignment[];
  }) => void;
  assignmentToTransfer?: Assignment[];
  setAssignmentToTransfer: (assignment: Assignment[]) => void;
  allAssignments: Assignment[];
};

const AssignmentsContext = createContext<AssignmentsContextType>({
  assignments: {
    initial: [],
    current: []
  },
  setAssignments: () => {},
  assignmentToTransfer: [],
  setAssignmentToTransfer: () => {},
  allAssignments: []
});

export const AssignmentsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const { assignmentToId } = useTechniciansContext();
  const { selectedWeekday } = useWeekdayContext();
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

  const [assignmentToTransfer, setAssignmentToTransfer] = useState<
    Assignment[]
  >([]);

  useEffect(() => {
    if (!userId) return;
    if (isError || isLoading) return;
    const filteredAssignments = data
      .filter(
        (assignment: Assignment) =>
          assignment.weekday === selectedWeekday &&
          assignment.assignmentToId === assignmentToId
      )
      .sort((a: Assignment, b: Assignment) => a.order - b.order);

    setAssignments({
      initial: [...filteredAssignments],
      current: [...filteredAssignments]
    });
    setAllAssignments(data);
  }, [data, isError, isLoading, selectedWeekday, assignmentToId, userId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <AssignmentsContext.Provider
      value={{
        assignments,
        setAssignments,
        assignmentToTransfer,
        setAssignmentToTransfer,
        allAssignments
      }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
};

export const useAssignmentsContext = () => useContext(AssignmentsContext);
