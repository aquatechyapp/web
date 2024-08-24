import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { Request } from '@/ts/interfaces/Request';

export default function useGetRequests() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await clientAxios('/requests');

      response?.data?.requests.forEach((request: Request) => {
        request.client.fullName = `${request.client.firstName} ${request.client.lastName}`;
      });
      return response.data;
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
