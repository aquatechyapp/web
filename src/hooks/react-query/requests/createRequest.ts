import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateRequest } from '@/app/(authenticated)/requests/ModalAddRequest';
import { clientAxios } from '@/lib/clientAxios';
import { createFormData } from '@/utils/formUtils';

import { useToast } from '../../../components/ui/use-toast';

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateRequest) =>
      await clientAxios.post('/requests', createFormData(data), {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      toast({
        duration: 2000,
        title: 'Request created successfully',
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
        title: 'Error creating request',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
