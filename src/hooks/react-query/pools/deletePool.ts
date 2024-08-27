import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { Client } from '@/ts/interfaces/Client';

export const useDeletePool = (queryKey: string[], poolId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await clientAxios.delete('/pools', {
        data: { id: poolId }
      }),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (old: Client) => {
        return {
          ...old,
          pools: old.pools.filter((pool) => pool.id !== poolId)
        };
      });
      toast({
        duration: 2000,
        title: 'Deleted pool successfully',
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
        title: 'Error deleting pool',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
