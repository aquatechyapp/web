import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { CreateServiceTypeRequest, ServiceTypeResponse } from '../../../ts/interfaces/ServiceTypes';

type ErrorResponse = {
  message: string;
};

export const useCreateServiceType = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateServiceTypeRequest): Promise<ServiceTypeResponse> => {
      const response = await clientAxios.post(`/service-types/companies/${companyId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types', companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Service type created successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error creating service type',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
