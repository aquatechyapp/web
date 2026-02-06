import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '@/lib/clientAxios';
import { DeleteInvoiceRequest, DeleteInvoiceResponse } from '@/ts/interfaces/Invoice';

import { useToast } from '@/components/ui/use-toast';

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (data: DeleteInvoiceRequest): Promise<DeleteInvoiceResponse> => {
      const response = await clientAxios.delete<DeleteInvoiceResponse>('/invoices', {
        data: {
          invoiceId: data.invoiceId
        }
      });
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate invoices list queries
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      // Invalidate the specific invoice query
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.invoiceId] });

      toast({
        duration: 2000,
        title: 'Invoice deleted successfully',
        variant: 'success'
      });
    },
    onError: (
      error: AxiosError<{
        message: string | string[];
      }>
    ) => {
      const errorMessage = error.response?.data?.message;
      const message = Array.isArray(errorMessage)
        ? errorMessage.join(', ')
        : errorMessage || 'Failed to delete invoice';

      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deleting invoice',
        description: message
      });
    }
  });

  return { mutate, mutateAsync, isPending, isSuccess };
};

