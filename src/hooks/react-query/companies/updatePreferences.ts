import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';

import { clientAxios } from '../../../lib/clientAxios';

type PreferencesData = {
  serviceEmailPreferences?: {
    sendEmails?: boolean;
    attachChemicalsReadings?: boolean;
    attachChecklist?: boolean;
    attachServicePhotos?: boolean;
    ccEmail?: string;
  };
  equipmentMaintenancePreferences?: {
    filterCleaningIntervalDays?: number;
  };
  companyId: string;
};

type ErrorResponse = {
  message: string;
};

export const useUpdateCompanyPreferences = (companyId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PreferencesData) => {
      return await clientAxios.patch(`/companies/${companyId}/preferences`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Preferences updated successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error updating preferences',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
