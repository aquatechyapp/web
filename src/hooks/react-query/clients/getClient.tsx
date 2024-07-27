import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

export default function useGetClient(clientId: string) {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients', clientId],
    queryFn: async () => {
      const response = await clientAxios(`/client/${clientId}`);

      if (response.data.clientWithLastService) {
        response.data.clientWithLastService.fullName = `${response.data.clientWithLastService.firstName} ${response.data.clientWithLastService.lastName}`;
      }

      return { ...response.data.clientWithLastService };
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
