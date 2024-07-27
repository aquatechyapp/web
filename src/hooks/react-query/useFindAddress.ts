import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function useFindAddress(zip: string) {
  const zipOnlyNumbers = zip.replaceAll(/\D/g, '');
  const { data, isLoading, isSuccess, refetch } = useQuery({
    enabled: false,
    queryKey: ['address', zipOnlyNumbers],
    queryFn: async () => {
      const response = await axios.get(
        `https://api.zipcodestack.com/v1/search?codes=${zipOnlyNumbers}&country=us&apikey=01J3S3XEAD59D5QHNYHNTHZSEF`
      );
      return response.data;
    },
    staleTime: Infinity
  });
  return { data, isLoading, isSuccess, refetch };
}
