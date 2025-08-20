import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { clientAxios } from '@/lib/clientAxios';
import { toast } from '@/components/ui/use-toast';

interface CreateChecklistTemplateRequest {
  companyId: string;
  poolId: string;
  name: string;
  items: Array<{
    label: string;
    order: number;
  }>;
}

interface CreateChecklistTemplateResponse {
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

const createChecklistTemplate = async (data: CreateChecklistTemplateRequest): Promise<CreateChecklistTemplateResponse> => {
  const response = await clientAxios.post('/checklist-templates/by-pool-id', data);
  return response.data;
};

export const useCreateChecklistTemplate = (clientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChecklistTemplate,
    onSuccess: (data) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['pools'] });
      queryClient.invalidateQueries({ queryKey: ['checklist-templates'] });
      queryClient.invalidateQueries({ queryKey: ['clients', clientId] });
      
      toast({
        title: 'Checklist created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      console.error('Error creating checklist template:', error);
      toast({
        title: 'Error creating checklist',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
