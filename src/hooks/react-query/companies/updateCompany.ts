import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { FormSchema } from '@/app/(authenticated)/team/ModalEditCompany';
import { useUserStore } from '@/store/user';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

export const useEditCompany = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { push } = useRouter();

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (data: FormSchema) =>
      await clientAxios.patch(`/companies`, {
        ...data
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });

      toast({
        duration: 5000,
        title: 'Information updated with success.',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 5000,
        variant: 'error',
        title: 'Error editing company.',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });

  return { handleSubmit, isPending };
};
