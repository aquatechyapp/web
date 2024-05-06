import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePool = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data, poolId }: { data: any, poolId: string }) =>
      await clientAxios.patch('/pools', { ...data, poolId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        variant: 'default',
        title: 'Pool updated successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        variant: 'default',
        title: 'Error updating pool',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
