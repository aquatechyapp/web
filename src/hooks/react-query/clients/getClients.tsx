import { useQuery } from '@tanstack/react-query';

import { Client } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';

export default function useGetClients() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      return response.data as Client[];
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
