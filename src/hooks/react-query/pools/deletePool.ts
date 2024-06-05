import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/components/ui/use-toast';
import { Client } from '@/interfaces/Client';
import { clientAxios } from '@/lib/clientAxios';

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
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error deleting pool',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
