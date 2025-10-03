import { useQuery, useQueryClient } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { Request } from '@/ts/interfaces/Request';

export interface UseGetRequestsParams {
  from: string;
  to: string;
  status: string | null;
  category: string | null;
  clientId: string | null;
  companyId: string | null;
  page: number;
  limit: number;
}

export default function useGetRequests(params: UseGetRequestsParams) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['requests', params],
    queryFn: async () => {
      console.log('API call with params:', params); // Debug log
      const response = await clientAxios.get('/requests', { params });
      response?.data?.requests.forEach((request: Request) => {
        request.client.fullName = `${request.client.firstName} ${request.client.lastName}`;
      });
      return response.data;
    },
    staleTime: Infinity
  });

  const refetch = async (newParams: UseGetRequestsParams) => {
    console.log('Refetch with params:', newParams); // Debug log
    return queryClient.fetchQuery({
      queryKey: ['requests', newParams],
      queryFn: async () => {
        const response = await clientAxios.get('/requests', { params: newParams });
        response?.data?.requests.forEach((request: Request) => {
          request.client.fullName = `${request.client.firstName} ${request.client.lastName}`;
        });
        return response.data;
      }
    });
  };

  return { ...query, refetch };
}
