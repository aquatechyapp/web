import { useMutation, useQueryClient } from '@tanstack/react-query';

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
        className: 'bg-green-500 text-gray-50'
      });
    },
    onError: () => {
      toast({
        duration: 2000,
        title: 'Error updating request',
        className: 'bg-red-500 text-gray-50'
      });
    }
  });
  return { mutate, isPending };
};
