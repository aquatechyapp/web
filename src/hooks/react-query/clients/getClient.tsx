import { clientAxios } from '../../../lib/clientAxios';
import { useQuery } from '@tanstack/react-query';

export default function useGetClient(clientId) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients', clientId],
    queryFn: async () => {
      const response = await clientAxios(`/client/${clientId}`);
      return response.data;
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
