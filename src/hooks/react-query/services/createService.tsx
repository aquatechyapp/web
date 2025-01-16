import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '../../../components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateService } from '@/ts/interfaces/Service';

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateService) => await clientAxios.post('/services', data),

    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        variant: 'error',
        title: 'Error creating service.',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      toast({
        variant: 'success',
        duration: 5000,
        title: 'Service created successfully'
      });
    }
  });
  return { mutate, isPending };
};
