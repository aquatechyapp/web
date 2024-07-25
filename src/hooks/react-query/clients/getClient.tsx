import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

export default function useGetClient(clientId: string) {
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
