import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateCompany } from '@/ts/interfaces/Company';
import { useUserStore } from '@/store/user';

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const user = useUserStore((state) => state.user);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateCompany) => await clientAxios.post('/companies', data),

    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error creating company',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['companyMembers', user.id] });
      toast({
        variant: 'success',
        duration: 2000,
        title: 'Company created successfully'
      });
    }
  });
  return { mutate, isPending };
};
