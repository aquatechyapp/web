import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '@/lib/clientAxios';
import { UpdateInvoiceRequest, UpdateInvoiceResponse } from '@/ts/interfaces/Invoice';

import { useToast } from '@/components/ui/use-toast';

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (data: UpdateInvoiceRequest): Promise<UpdateInvoiceResponse> => {
      // Ensure all numeric fields are properly converted to numbers
      const payload: UpdateInvoiceRequest = {
        ...data,
        subtotal: data.subtotal !== undefined ? Number(data.subtotal) : undefined,
        taxRate: data.taxRate !== undefined ? Number(data.taxRate) : undefined,
        discountRate: data.discountRate !== undefined ? Number(data.discountRate) : undefined,
        lineItems: data.lineItems?.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      const response = await clientAxios.patch<UpdateInvoiceResponse>('/invoices/', payload);
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate invoices list queries
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      
      // Invalidate the specific invoice query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.invoiceId] });

      toast({
        duration: 2000,
        title: 'Invoice updated successfully',
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
        : errorMessage || 'Failed to update invoice';

      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error updating invoice',
        description: message
      });
    }
  });

  return { mutate, mutateAsync, isPending, isSuccess };
};

