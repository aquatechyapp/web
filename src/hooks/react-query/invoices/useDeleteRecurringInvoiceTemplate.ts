import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '@/lib/clientAxios';
import {
  DeleteRecurringInvoiceTemplateRequest,
  DeleteRecurringInvoiceTemplateResponse
} from '@/ts/interfaces/RecurringInvoiceTemplate';

import { useToast } from '@/components/ui/use-toast';

export const useDeleteRecurringInvoiceTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (
      data: DeleteRecurringInvoiceTemplateRequest
    ): Promise<DeleteRecurringInvoiceTemplateResponse> => {
      const response = await clientAxios.delete<DeleteRecurringInvoiceTemplateResponse>(
        '/recurring-invoice-templates',
        {
          data: {
            templateId: data.templateId
          }
        }
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      // Invalidate recurring invoice templates list queries
      queryClient.invalidateQueries({ queryKey: ['recurring-invoice-templates'] });

      // Invalidate the specific template query
      queryClient.invalidateQueries({
        queryKey: ['recurring-invoice-template', variables.templateId]
      });

      toast({
        duration: 2000,
        title: 'Recurring invoice template deleted successfully',
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
        : errorMessage || 'Failed to delete recurring invoice template';

      toast({
        duration: 2000,
        variant: 'error',
        title: 'Error deleting recurring invoice template',
        description: message
      });
    }
  });

  return { mutate, mutateAsync, isPending, isSuccess };
};




