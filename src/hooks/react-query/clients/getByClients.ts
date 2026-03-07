import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

export default function useGetByClients(clientId?: string) {
  return useQuery({
    queryKey: ['byClients', clientId],
    queryFn: async () => {
      const response = await clientAxios.get(`/by-client/${clientId}`);
      return response.data;
    },
    enabled: !!clientId
  });
}
