import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreatePoolType } from '@/app/(authenticated)/clients/DataTableClients/ModalAddPool';
import { clientAxios } from '@/lib/clientAxios';
import { createFormData } from '@/utils/formUtils';

import { useToast } from '../../../components/ui/use-toast';

export const useAddPoolToClient = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreatePoolType) =>
      await clientAxios.post('/pools', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        duration: 2000,
        title: 'Pool created successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error creating pool',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
