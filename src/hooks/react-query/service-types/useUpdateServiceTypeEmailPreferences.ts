import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';
import { ServiceTypeEmailPreferences } from '../../../ts/interfaces/ServiceTypeEmailPreferences';
import { ServiceTypeResponse } from '../../../ts/interfaces/ServiceTypes';

interface UpdateServiceTypeEmailPreferencesRequest {
  serviceTypeEmailPreferences: ServiceTypeEmailPreferences;
}

type ErrorResponse = {
  message: string;
};

export const useUpdateServiceTypeEmailPreferences = (serviceTypeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ServiceTypeEmailPreferences): Promise<ServiceTypeResponse> => {
      const response = await clientAxios.patch(
        `/service-types/${serviceTypeId}/email-preferences`,
        {
          serviceTypeEmailPreferences: data
        } as UpdateServiceTypeEmailPreferencesRequest
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate service types query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Email preferences updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating email preferences',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
