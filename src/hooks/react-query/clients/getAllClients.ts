import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';

export default function useGetAllClients() {
  return useQuery({
    queryKey: ['allClients'],
    queryFn: async () => {
      const response = await clientAxios.get('/clients/all');
      // create a full name for each client by combining first and last name
      response.data?.clients.forEach((client: Client) => {
        client.fullName = `${client.firstName} ${client.lastName}`;
      });

      const res: Client[] = response.data.clients;

      return res;
    }
  });
}
