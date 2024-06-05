import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useDeactivateClient = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (clientId: string) => await clientAxios.patch('/clients', { isActive: false, clientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      push('/clients');
      toast({
        duration: 2000,
        title: 'Client deactivated successfully',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error deactivating client',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
