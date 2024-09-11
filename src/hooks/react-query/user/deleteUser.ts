import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { toast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useDeleteUser = () => {
  const router = useRouter();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async () => await clientAxios.delete('/users'),
    onSuccess: async () => {
      toast({
        duration: 2000,
        title: 'Your account has been deleted',
        variant: 'success'
      });
      router.push('/login');
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deleting your account',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending, isError };
};
