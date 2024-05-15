import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

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
