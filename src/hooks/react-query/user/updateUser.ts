import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import { IUserSchema } from '@/app/(authenticated)/account/page';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useUpdateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: IUserSchema) => await clientAxios.patch('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        duration: 2000,
        title: 'User updated successfully',
        variant: 'success'
      });
      push('/dashboard');
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error updating user',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
