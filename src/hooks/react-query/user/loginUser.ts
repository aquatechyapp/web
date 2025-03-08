import { useMutation } from '@tanstack/react-query';
import { AxiosError, isAxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { toast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type LoginData = {
  email: string;
  password: string;
};

export const useResendConfirmation = (email: string) => {
  return useMutation({
    mutationFn: async () => await clientAxios.post('/users/resend-account-confirmation-email', { email }),
    onError: (error) => {
      throw new Error(isAxiosError(error) ? error.response?.data.message : 'Error resending confirmation');
    }
  });
};

export const useLoginUser = () => {
  const { push } = useRouter();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: LoginData) => await clientAxios.post('/sessions', data),
    onSuccess: async ({ data }) => {
      Cookies.set('accessToken', data.accessToken);
      Cookies.set('userId', data.user.id);
      // setUser({
      //   ...data.user,
      //   incomeAsACompany: data.incomeAsACompany,
      //   incomeAsASubcontractor: data.incomeAsASubcontractor
      // });
      if (data.user.firstName === '') {
        push('/account');

        return;
      }
      push('/dashboard');
    },
    onError: (error): Error | AxiosError => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          if (error.response?.data.message === 'Invalid email or password.') {
            toast({
              variant: 'error',
              duration: 5000,
              title: 'Invalid email or password'
            });
            return error;
          } else if (error.response?.data.message === 'User not activated.') {
            return error;
          } else {
            toast({
              variant: 'error',
              duration: 5000,
              title: 'Internal error'
            });
            return error;
          }
        }
      }
      if (error.message === 'Network Error') {
        toast({
          duration: 5000,
          title: 'Internal error',
          variant: 'error'
        });
      }
      return error;
    }
  });
  return { mutate, isPending, error };
};
