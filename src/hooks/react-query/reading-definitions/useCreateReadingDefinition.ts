import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateReadingDefinitionRequest, ReadingDefinitionResponse } from '../../../ts/interfaces/ReadingGroups';

type ErrorResponse = {
  message: string;
};

export const useCreateReadingDefinition = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ readingGroupId, data }: { readingGroupId: string; data: CreateReadingDefinitionRequest }): Promise<ReadingDefinitionResponse> => {
      const response = await clientAxios.post(`/reading-definitions/reading-groups/${readingGroupId}`, data);
      return response.data;
    },
    onSuccess: (_, { readingGroupId }) => {
      queryClient.invalidateQueries({ queryKey: ['reading-definitions', readingGroupId] });
      queryClient.invalidateQueries({ queryKey: ['reading-groups', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Reading definition created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating reading definition',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};

