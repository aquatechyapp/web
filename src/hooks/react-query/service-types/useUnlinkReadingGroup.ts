import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useUnlinkReadingGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, readingGroupId }: { serviceTypeId: string; readingGroupId: string }): Promise<void> => {
      await clientAxios.delete(`/service-types/${serviceTypeId}/reading-groups/${readingGroupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Reading group unlinked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error unlinking reading group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
