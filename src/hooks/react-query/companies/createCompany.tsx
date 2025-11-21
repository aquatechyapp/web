import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateCompany } from '@/ts/interfaces/Company';
import { useUserStore } from '@/store/user';
import { useRouter } from 'next/navigation';

export const useCreateCompany = (options?: { skipRedirect?: boolean }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { mutate, isPending, isSuccess } = useMutation({
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
        duration: 5000,
        title: 'Company created successfully'
      });
      if (!options?.skipRedirect) {
        router.push('/team/myCompanies');
      }
    }
  });
  return { mutate, isPending, isSuccess };
};
