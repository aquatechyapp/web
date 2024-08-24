import { useQuery } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';

export default function useGetClients() {
  const {
    data = [],
    isLoading,
    isSuccess
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      // create a full name for eacth client by combining first and last name
      response.data?.clients.forEach((client: Client) => {
        client.fullName = `${client.firstName} ${client.lastName}`;
      });

      const clients: Client[] | [] = response.data.clients ? response.data.clients : [];

      return clients;
    }
  });
  return { data, isLoading, isSuccess };
}
