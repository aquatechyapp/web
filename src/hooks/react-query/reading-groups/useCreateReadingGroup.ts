import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateReadingGroupRequest, ReadingGroupResponse } from '../../../ts/interfaces/ReadingGroups';

type ErrorResponse = {
  message: string;
};

export const useCreateReadingGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReadingGroupRequest): Promise<ReadingGroupResponse> => {
      const response = await clientAxios.post(`/reading-groups/companies/${companyId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Reading group created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating reading group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

