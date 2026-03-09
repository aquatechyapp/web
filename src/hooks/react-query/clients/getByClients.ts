import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

export default function useGetPoolsByClient(clientId?: string) {
  return useQuery({
    queryKey: ['poolsByClient', clientId],
    queryFn: async () => {
      const response = await clientAxios.get(`/pools/by-client/${clientId}`);
     return response.data?.pools || [];
    },
    enabled: !!clientId
  });
}
