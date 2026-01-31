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

      // Backend stores prices in cents; convert to dollars for display
      const toDollars = (cents: number) => (cents ?? 0) / 100;
      const templates = response.data.templates.map((template) => ({
        ...template,
        subtotal: toDollars(template.subtotal),
        taxAmount: toDollars(template.taxAmount),
        discountAmount: toDollars(template.discountAmount),
        total: toDollars(template.total),
        lineItems: template.lineItems.map((item) => ({
          ...item,
          unitPrice: toDollars(item.unitPrice),
          amount: toDollars(item.amount)
        })),
        ...(template.invoices?.length
          ? {
              invoices: template.invoices.map((inv) => ({
                ...inv,
                total: toDollars(inv.total)
              }))
            }
          : {})
      }));

      return { ...response.data, templates };
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

        // Backend stores prices in cents; convert to dollars for display
        const toDollars = (cents: number) => (cents ?? 0) / 100;
        const templates = response.data.templates.map((template) => ({
          ...template,
          subtotal: toDollars(template.subtotal),
          taxAmount: toDollars(template.taxAmount),
          discountAmount: toDollars(template.discountAmount),
          total: toDollars(template.total),
          lineItems: template.lineItems.map((item) => ({
            ...item,
            unitPrice: toDollars(item.unitPrice),
            amount: toDollars(item.amount)
          })),
          ...(template.invoices?.length
            ? {
                invoices: template.invoices.map((inv) => ({
                  ...inv,
                  total: toDollars(inv.total)
                }))
              }
            : {})
        }));

        return { ...response.data, templates };
      }
    });
  };

  return { ...query, refetch };
}
