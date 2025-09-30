import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';

export const useDeactivatePool = (queryKey: string[], poolId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const userId = Cookies.get('userId');

  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await clientAxios.patch('/pools/inactivate', {
        id: poolId
      }),
    onSuccess: () => {
      // Update the specific pool in the client's pools array
      queryClient.setQueryData(queryKey, (old: Client) => {
        return {
          ...old,
          pools: old.pools.map((pool) => 
            pool.id === poolId 
              ? { ...pool, isActive: false } 
              : pool
          )
        };
      });
      
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', userId] });
      queryClient.invalidateQueries({ queryKey: ['schedule', userId] });
      
      toast({
        duration: 5000,
        title: 'Pool deactivated successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deactivating pool',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
