import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';

export default function useGetRequests() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await clientAxios('/requests');
      return response.data;
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
