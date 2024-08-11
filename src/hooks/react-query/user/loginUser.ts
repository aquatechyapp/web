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
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: (error): Error | AxiosError => {
      if (isAxiosError(error)) {
        if (error.response?.status === 401 && error.response?.data.message === 'Invalid email or password.') {
          toast({
            duration: 2000,
            title: 'Invalid email or password',
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
  return { mutate, isPending, error };
};
