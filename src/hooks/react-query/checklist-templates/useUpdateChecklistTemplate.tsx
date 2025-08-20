import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { clientAxios } from '@/lib/clientAxios';
import { toast } from '@/components/ui/use-toast';

interface UpdateChecklistTemplateRequest {
  templateId: string;
  items: Array<{
    label: string;
    order: number;
  }>;
}

interface UpdateChecklistTemplateResponse {
  template: {
    id: string;
    name: string;
    description?: string;
    companyId: string;
    poolId: string;
    isActive: boolean;
    isDefault: boolean;
    createdAt: string;
    items: Array<{
      id: string;
      templateId: string;
      label: string;
      order: number;
      createdAt: string;
    }>;
  };
}

type ErrorResponse = {
  message: string;
};

const updateChecklistTemplate = async (data: UpdateChecklistTemplateRequest): Promise<UpdateChecklistTemplateResponse> => {
  const { templateId, ...updateData } = data;
  const response = await clientAxios.patch(`/checklist-templates/${templateId}`, updateData);
  return response.data;
};

export const useUpdateChecklistTemplate = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateChecklistTemplate,
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
      
      toast({
        title: 'Checklist updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error updating checklist template:', error);
      toast({
        title: 'Error updating checklist',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
