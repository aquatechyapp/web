import { useMutation } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { toast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type SendRecoverEmail = {
  newPassword: string;
  token: string;
};

export const useResetPassword = () => {
  const router = useRouter();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: SendRecoverEmail) => await clientAxios.patch('/recoveraccount', data),
    onSuccess: async () => {
      toast({
        duration: 2000,
        title: 'Password reset successfully!',
        variant: 'success'
      });
      router.push('/login');
    },
    onError: (error): Error | AxiosError => {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast({
            duration: 5000,
            title: 'Email not found',
            variant: 'error'
          });
          return error;
        }
      }
      if (error.message === 'Network Error') {
        toast({
          duration: 5000,
          title: 'Internal error',
          description: 'Please try again later',
          variant: 'error'
        });
      }

      return error;
    }
  });
  return { mutate, isPending, isError };
};
