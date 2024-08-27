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
      push('/dashboard');
      toast({
        duration: 2000,
        title: 'Login successful!',
        variant: 'success'
      });
    },
    onError: (error): Error | AxiosError => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 && error.response?.data.message === 'Invalid email or password.') {
          toast({
            variant: 'error',
            duration: 5000,
            title: 'Invalid email or password'
          });
          return error;
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
