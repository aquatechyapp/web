import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

interface UseGetServicesParams {
  from: string;
  to: string;
  technicianId?: number;
  clientId?: number;
  page?: number;
}

export default function useGetServices({ from, to, technicianId, clientId, page = 1 }: UseGetServicesParams) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['services', { from, to, technicianId, clientId, page }],
    queryFn: async () => {
      const response = await clientAxios.get('/services', {
        params: {
          from,
          to,
          technicianId,
          clientId,
          page
        }
      });

      console.log('response', response);

      return response.data;
    },
    staleTime: Infinity,
    enabled: Boolean(from && to) // Ensure the query only runs when required parameters are present
  });

  return { data, isLoading, isSuccess };
}
