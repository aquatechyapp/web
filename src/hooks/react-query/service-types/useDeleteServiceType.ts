import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useDeleteServiceType = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceTypeId: string): Promise<void> => {
      await clientAxios.delete(`/service-types/${serviceTypeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Service type deleted successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error deleting service type',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
