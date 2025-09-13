import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { UpdateReadingGroupRequest, ReadingGroupResponse } from '../../../ts/interfaces/ReadingGroups';

type ErrorResponse = {
  message: string;
};

export const useUpdateReadingGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ readingGroupId, data }: { readingGroupId: string; data: UpdateReadingGroupRequest }): Promise<ReadingGroupResponse> => {
      const response = await clientAxios.patch(`/reading-groups/${readingGroupId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Reading group updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating reading group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

