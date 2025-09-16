import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { LinkReadingGroupRequest, ServiceTypeReadingGroupResponse } from '../../../ts/interfaces/ServiceTypes';

type ErrorResponse = {
  message: string;
};

export const useLinkReadingGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, data }: { serviceTypeId: string; data: LinkReadingGroupRequest }): Promise<ServiceTypeReadingGroupResponse> => {
      const response = await clientAxios.post(`/service-types/${serviceTypeId}/reading-groups`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Reading group linked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error linking reading group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
