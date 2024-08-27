import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { EditRequest } from '@/app/(authenticated)/requests/ModalEditRequest';
import { useToast } from '@/components/ui/use-toast';
import { clientAxios } from '@/lib/clientAxios';

export const useUpdateRequest = (requestId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: EditRequest) =>
      await clientAxios.patch('/requests', { outcome: data.outcome, status: data.status, id: requestId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      // Atualizer sem fazer nova requests, mas precisa pedir pro Kawan retornar client também
      // queryClient.setQueryData(['requests'], (oldData) => {
      //   const newRequests = oldData?.requests.map((request) => {
      //     if (request.id === requestId) {
      //       return { ...response.data.updatedRequest };
      //     }
      //     return { ...request };
      //   });

      //   return { requests: newRequests };
      // });
      toast({
        duration: 2000,
        title: 'Request updated successfully',
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
        title: 'Error updating request',
        description: error.response?.data?.message ? error.response.data.message : 'Internal server error'
      });
    }
  });
  return { mutate, isPending };
};
