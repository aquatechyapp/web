import { clientAxios } from '@/services/clientAxios';
import { useQuery } from '@tanstack/react-query';

export default function useGetClients() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data;
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
