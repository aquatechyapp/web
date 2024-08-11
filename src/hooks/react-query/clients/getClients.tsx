import { useQuery } from '@tanstack/react-query';

import { Client } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';

export default function useGetClients() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientAxios('/clients');
      // create a full name for eacth client by combining first and last name
      response.data?.clients.forEach((client: Client) => {
        client.fullName = `${client.firstName} ${client.lastName}`;
      });

      return response.data?.clients as Client[];
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess };
}
