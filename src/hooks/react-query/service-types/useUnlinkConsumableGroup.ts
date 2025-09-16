import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from '@/components/ui/use-toast';
import { clientAxios } from '../../../lib/clientAxios';

type ErrorResponse = {
  message: string;
};

export const useUnlinkConsumableGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceTypeId, consumableGroupId }: { serviceTypeId: string; consumableGroupId: string }): Promise<void> => {
      await clientAxios.delete(`/service-types/${serviceTypeId}/consumable-groups/${consumableGroupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-types'] });
      toast({
        title: 'Consumable group unlinked successfully',
        variant: 'success'
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast({
        title: 'Error unlinking consumable group',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'error'
      });
    }
  });
};
