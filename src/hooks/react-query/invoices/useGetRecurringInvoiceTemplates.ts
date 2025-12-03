import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/clientAxios';

export interface RecurringInvoiceTemplate {
  id: string;
  clientId: string;
  clientName?: string;
  poolId?: string;
  startDate: string;
  frequency: 'weekly' | 'monthly' | 'yearly';
  delivery: 'draft' | 'auto-send';
  referenceNumber?: string;
  paymentTerms: number;
  discount: number;
  taxRate: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export default function useGetRecurringInvoiceTemplates() {
  return useQuery({
    queryKey: ['recurring-invoice-templates'],
    queryFn: async () => {
      const response = await clientAxios.get('/recurring-invoice-templates');
      return response.data.templates || [];
    }
  });
}

