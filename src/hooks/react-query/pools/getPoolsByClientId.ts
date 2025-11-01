import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { Pool } from '@/ts/interfaces/Pool';

export default function useGetPoolsByClientId(clientId: string | null | undefined) {
  return useQuery({
    queryKey: ['poolsByClientId', clientId],
    queryFn: async () => {
      const response = await clientAxios.get(`/pools/by-client/${clientId}`);
      const pools: Pool[] = response.data.pools || [];
      return pools;
    },
    enabled: !!clientId, // Only fetch when clientId is provided
    staleTime: 30000 // Cache for 30 seconds
  });
}

