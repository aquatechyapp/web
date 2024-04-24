import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

export const useUpdatePool = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const poolId = pathname.split('/')[2];

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ data, poolId }) =>
      await clientAxios.patch('/pools', { ...data, poolId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        variant: 'default',
        title: 'Pool updated successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error updating pool',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
