import { useToast } from '@/app/_components/ui/use-toast';
import { clientAxios } from '@/services/clientAxios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useDeactivateClient = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (clientId) =>
      await clientAxios.patch('/clients', { isActive: false, clientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      push('/clients');
      toast({
        variant: 'default',
        title: 'Client deactivated successfully',
        className: 'bg-green-500 text-white'
      });
    },
    onError: (error) => {
      toast({
        variant: 'default',
        title: 'Error deactivating client',
        className: 'bg-red-500 text-white'
      });
    }
  });
  return { mutate, isPending };
};
