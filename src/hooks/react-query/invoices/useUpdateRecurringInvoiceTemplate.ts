import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '@/lib/clientAxios';
import {
  UpdateRecurringInvoiceTemplateRequest,
  UpdateRecurringInvoiceTemplateResponse
} from '@/ts/interfaces/RecurringInvoiceTemplate';

import { useToast } from '@/components/ui/use-toast';

export const useUpdateRecurringInvoiceTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (
      data: UpdateRecurringInvoiceTemplateRequest
    ): Promise<UpdateRecurringInvoiceTemplateResponse> => {
      // Ensure all numeric fields are properly converted to numbers
      const payload: UpdateRecurringInvoiceTemplateRequest = {
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

      const response = await clientAxios.patch<UpdateRecurringInvoiceTemplateResponse>(
        '/recurring-invoice-templates',
        payload
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate recurring invoice templates list queries
      queryClient.invalidateQueries({ queryKey: ['recurring-invoice-templates'] });

      // Invalidate the specific template query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['recurring-invoice-template', variables.templateId]
      });

      toast({
        duration: 2000,
        title: 'Recurring invoice template updated successfully',
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
        : errorMessage || 'Failed to update recurring invoice template';

      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error updating recurring invoice template',
        description: message
      });
    }
  });

  return { mutate, mutateAsync, isPending, isSuccess };
};




