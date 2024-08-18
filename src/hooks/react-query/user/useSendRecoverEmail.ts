import { useMutation } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';

import { toast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type SendRecoverEmail = {
  email: string;
};

export const useSendRecoverEmail = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: SendRecoverEmail) => await clientAxios.post('/sendrecoverpasswordemail', data),
    onSuccess: async () => {
      toast({
        duration: 2000,
        title: 'Email with instructions for password recovery sent successfully!',
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: (error): Error | AxiosError => {
      if (isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast({
            duration: 2000,
            title: 'Email not found',
            className: 'bg-red-500 text-gray-50'
          });
          return error;
        }
      }
      if (error.message === 'Network Error') {
        toast({
          duration: 2000,
          title: 'Internal error',
          description: 'Please try again later',
          className: 'bg-red-500 text-gray-50'
        });
      }
      return error;
    }
  });
  return { mutate, isPending, isError };
};
