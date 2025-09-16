import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateChecklistTemplateByPoolRequest, ChecklistTemplateResponse } from '../../../ts/interfaces/ChecklistTemplates';

type ErrorResponse = {
  message: string;
};

export const useCreateChecklistTemplateByPoolId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChecklistTemplateByPoolRequest): Promise<ChecklistTemplateResponse> => {
      const response = await clientAxios.post('/checklist-templates/by-pool-id', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Pool-specific checklist template created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating pool-specific checklist template',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
