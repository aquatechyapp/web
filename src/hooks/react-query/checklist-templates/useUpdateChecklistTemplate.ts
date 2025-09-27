import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { UpdateChecklistTemplateRequest, ChecklistTemplateResponse } from '../../../ts/interfaces/ChecklistTemplates';

type ErrorResponse = {
  message: string;
};

export const useUpdateChecklistTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string; data: UpdateChecklistTemplateRequest }): Promise<ChecklistTemplateResponse> => {
      const response = await clientAxios.patch(`/checklist-templates/${templateId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Checklist template updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating checklist template',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
