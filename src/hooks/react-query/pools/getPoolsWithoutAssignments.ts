import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';
import { Pool } from '@/ts/interfaces/Pool';

export default function useGetPoolsWithoutAssignments() {
  return useQuery({
    queryKey: ['poolsWithoutAssignments'],
    queryFn: async () => {
      const response = await clientAxios.get('/pools/without-assignments');
      
      const res: Pool[] = response.data.pools || [];

      return res;
    }
  });
}