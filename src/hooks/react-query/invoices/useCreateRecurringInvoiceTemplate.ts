import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { clientAxios } from '@/lib/clientAxios';
import { useToast } from '@/components/ui/use-toast';

export interface RecurringInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface CreateRecurringInvoiceTemplateData {
  clientId: string;
  poolId?: string;
  startDate: Date;
  frequency: 'weekly' | 'monthly' | 'yearly';
  delivery: 'draft' | 'auto-send';
  referenceNumber?: string;
  paymentTerms: number; // Number of days: 1, 3, 7, 15, 30, or 60
  discount: number; // Percentage
  lineItems: RecurringInvoiceLineItem[];
  taxRate: number;
  notes: string;
  paymentInstructions: string;
}

export const useCreateRecurringInvoiceTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: CreateRecurringInvoiceTemplateData) => {
      // Convert Date to ISO string for API
      const payload = {
        ...data,
        startDate: data.startDate.toISOString()
      };
      const response = await clientAxios.post('/recurring-invoice-templates', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-invoice-templates'] });
      toast({
        duration: 2000,
        title: 'Recurring invoice template created successfully',
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
        title: 'Error creating recurring invoice template',
        description: error.response?.data?.message || 'Internal server error'
      });
    }
  });

  return { mutate, isPending };
};

