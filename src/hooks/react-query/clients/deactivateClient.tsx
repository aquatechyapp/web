import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
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
        title: 'Error deactivating client',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
