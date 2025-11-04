import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { Assignment } from '@/ts/interfaces/Assignments';

type GetAssignmentsByPoolResponse = {
  assignments: Assignment[];
};

export function useGetAssignmentsByPool(poolId: string) {
  const { data, isLoading, isError } = useQuery<GetAssignmentsByPoolResponse>({
    queryKey: ['assignments', 'by-pool', poolId],
    queryFn: async () => {
      const response = await clientAxios.get('/assignments/by-pool', {
        params: { poolId }
      });
      return response.data;
    },
    enabled: !!poolId,
    staleTime: 30000
  });

  return {
    assignments: data?.assignments || [],
    isLoading,
    isError
  };
}

