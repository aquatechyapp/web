import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { usePathname } from 'next/navigation';

import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useUpdateClient = <T>() => {
  const { toast } = useToast();
  const pathname = usePathname();
  const clientId = pathname.split('/')[2];

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: T) => await clientAxios.patch('/clients', { ...data, clientId }),
    onSuccess: () => {
      toast({
        duration: 2000,
        title: 'Client updated successfully',
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
        title: 'Error updating client',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
