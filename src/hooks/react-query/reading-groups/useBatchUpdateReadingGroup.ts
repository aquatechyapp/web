import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CrudReadingGroupRequest, CrudReadingGroupResponse } from '../../../ts/interfaces/ReadingGroups';


type ErrorResponse = {
  message: string;
};

export const useBatchUpdateReadingGroup = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      readingGroupId, 
      data 
    }: { 
      readingGroupId: string; 
      data: CrudReadingGroupRequest 
    }): Promise<CrudReadingGroupResponse> => {
      const response = await clientAxios.put(`/reading-groups/${readingGroupId}/crud`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-definitions'] });
      queryClient.invalidateQueries({ queryKey: ['reading-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Reading definitions updated successfully',
        description: 'All changes have been saved in a single operation',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating reading definitions',
        description: error.response?.data?.message || 'An error occurred while saving changes',
        variant: 'error'
      });
    }
  });
};
