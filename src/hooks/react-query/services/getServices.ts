import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

interface UseGetServicesParams {
  from: string;
  to: string;
  memberId?: string | null;
  clientId?: string | null;
  companyOwnerId?: string | null;
  page?: number;
}

export default function useGetServices({
  from,
  to,
  memberId,
  clientId,
  companyOwnerId,
  page = 1
}: UseGetServicesParams) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await clientAxios.get('/services', {
        params: {
          from,
          to,
          assignedToId: memberId,
          companyOwnerId,
          clientId,
          page
        }
      });

      return response.data;
    },
    staleTime: Infinity,
    enabled: Boolean(from && to) // Ensure the query only runs when required parameters are present
  });

  return { data, isLoading, isSuccess };
}
