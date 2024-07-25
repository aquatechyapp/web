import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useAssignmentsContext } from '@/context/assignments';
import { Assignment } from '@/interfaces/Assignments';
import { clientAxios } from '@/lib/clientAxios';
import { useTechniciansStore } from '@/store/technicians';
import { useWeekdayStore } from '@/store/weekday';

export default function useGetAssignments() {
  const { push } = useRouter();
  const userId = Cookies.get('userId');
  const { setAssignments } = useAssignmentsContext();
  const assignmentToId = useTechniciansStore((state) => state.assignmentToId);
  const selectedWeekday = useWeekdayStore((state) => state.selectedWeekday);

  if (!userId) {
    push('/login');
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assignments', userId],
    queryFn: async () =>
      await clientAxios.get('/assignments').then((res) => {
        const filteredAssignments = res.data
          ?.filter(
            (assignment: Assignment) =>
              assignment.weekday === selectedWeekday && assignment.assignmentToId === assignmentToId
          )
          .sort((a: Assignment, b: Assignment) => a.order - b.order);

        setAssignments({
          initial: [...filteredAssignments],
          current: [...filteredAssignments]
        });
      }),
    staleTime: 1000 * 60 * 60
  });

  return { data, isLoading, isError };
}
