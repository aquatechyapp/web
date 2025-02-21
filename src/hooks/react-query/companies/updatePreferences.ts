import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';

import { clientAxios } from '../../../lib/clientAxios';

type CompanyEmailPreferences = {
  sendEmails: boolean;
  attachChemicalsReadings: boolean;
  attachChecklist: boolean;
  attachServiceNotes: boolean;
  attachServicePhotos: boolean;
  ccEmail: string;
};

export const useUpdateCompanyPreferences = (companyId: string) => {
  const { toast } = useToast();

  const { mutate, isPending, data, isSuccess } = useMutation({
    mutationFn: async (companyEmailPreferences: CompanyEmailPreferences) =>
      await clientAxios.patch(`/companies/${companyId}/preferences`, {
        companyId,
        serviceEmailPreferences: { ...companyEmailPreferences }
      }),
    onSuccess: () => {
      toast({
        duration: 5000,
        title: 'Email preferences updated successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string;
      }>
    ) => {
      toast({
        duration: 5000,
        variant: 'error',
        title: 'Error updating email preferences.',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending, data, isSuccess };
};
