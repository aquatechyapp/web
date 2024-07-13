import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useLoginUser = () => {
  const { push } = useRouter();
  const { toast } = useToast();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data) => await clientAxios.post('/sessions', data),
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
    onError: (error) => {
      if (error.message === 'Network Error') {
        toast({
          duration: 2000,
          title: 'Internal error',
          description: 'Please try again later',
          className: 'bg-red-500 text-gray-50'
        });
      }
    }
  });
  return { mutate, isPending, error };
};
