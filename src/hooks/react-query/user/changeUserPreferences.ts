import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useToast } from '@/components/ui/use-toast';

import { clientAxios } from '../../../lib/clientAxios';

type UserEmailPreferences = {
  sendEmails: boolean;
  attachChemicalsReadings: boolean;
  attachChecklist: boolean;
  attachServiceNotes: boolean;
  attachServicePhotos: boolean;
  ccEmail: string;
};

export const useChangeUserPreferences = () => {
  const { toast } = useToast();

  const { mutate, isPending, data, isSuccess } = useMutation({
    mutationFn: async (userEmailPreferences: UserEmailPreferences) =>
      await clientAxios.patch('/users/preferences', { serviceEmailPreferences: { ...userEmailPreferences } }),
    onSuccess: () => {
      toast({
        duration: 2000,
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
        duration: 2000,
        variant: 'error',
        title: 'Error updating preferences email settings',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending, data, isSuccess };
};
