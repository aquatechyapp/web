import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { ChecklistTemplateResponse } from '../../../ts/interfaces/ChecklistTemplates';

type ErrorResponse = {
  message: string;
};

export const useSetDefaultChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string): Promise<ChecklistTemplateResponse> => {
      const response = await clientAxios.post(`/checklist-templates/${templateId}/set-default`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Default checklist template updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error setting default checklist template',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
