import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';

interface GetClientsResponse {
  clients: Client[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function useGetClients(page = 1) {
  return useQuery({
    queryKey: ['clients', page],
    queryFn: async () => {
      const response = await clientAxios.get(`/clients?page=${page}&limit=20`);

      // create a full name for each client by combining first and last name
      response.data?.clients.forEach((client: Client) => {
        client.fullName = `${client.firstName} ${client.lastName}`;
      });

      return {
        clients: response.data.clients || [],
        totalCount: response.data.totalCount || 0,
        currentPage: page,
        itemsPerPage: 20
      };
    }
  });
}
