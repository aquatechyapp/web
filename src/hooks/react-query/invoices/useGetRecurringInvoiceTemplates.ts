import { useQuery, useQueryClient } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import {
  ListRecurringInvoiceTemplatesParams,
  ListRecurringInvoiceTemplatesResponse,
  RecurringInvoiceTemplate
} from '@/ts/interfaces/RecurringInvoiceTemplate';

// Export the type for backward compatibility
export type { RecurringInvoiceTemplate };

export default function useGetRecurringInvoiceTemplates(
  params?: ListRecurringInvoiceTemplatesParams
) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['recurring-invoice-templates', params],
    queryFn: async () => {
      // Build query params - only include defined values
      const queryParams: Record<string, string | boolean> = {};

      if (params?.clientId) {
        queryParams.clientId = params.clientId;
      }
      if (params?.isActive !== undefined) {
        queryParams.isActive = params.isActive;
      }

      const response = await clientAxios.get<ListRecurringInvoiceTemplatesResponse>(
        '/recurring-invoice-templates',
        {
          params: queryParams
        }
      );

      return response.data;
    },
    staleTime: Infinity
  });

  const refetch = async (newParams?: ListRecurringInvoiceTemplatesParams) => {
    return queryClient.fetchQuery({
      queryKey: ['recurring-invoice-templates', newParams],
      queryFn: async () => {
        // Build query params - only include defined values
        const queryParams: Record<string, string | boolean> = {};

        if (newParams?.clientId) {
          queryParams.clientId = newParams.clientId;
        }
        if (newParams?.isActive !== undefined) {
          queryParams.isActive = newParams.isActive;
        }

        const response = await clientAxios.get<ListRecurringInvoiceTemplatesResponse>(
          '/recurring-invoice-templates',
          {
            params: queryParams
          }
        );

        return response.data;
      }
    });
  };

  return { ...query, refetch };
}
