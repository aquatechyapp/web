import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateChecklistTemplateRequest, ChecklistTemplateResponse } from '../../../ts/interfaces/ChecklistTemplates';

type ErrorResponse = {
  message: string;
};

export const useCreateChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateChecklistTemplateRequest): Promise<ChecklistTemplateResponse> => {
      const response = await clientAxios.post('/checklist-templates', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Checklist template created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating checklist template',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
