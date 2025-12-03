import { useQuery, useQueryClient } from '@tanstack/react-query';

import { clientAxios } from '@/lib/clientAxios';
import { Invoice as ApiInvoice } from '@/ts/interfaces/Invoice';

export interface UseGetInvoicesParams {
  page?: number;
  clientId?: string | null;
  companyOwnerId?: string | null;
  status?: 'paid' | 'unpaid' | 'draft' | 'overdue' | 'cancelled' | null;
  fromDate?: string | null;
  toDate?: string | null;
}

export interface ListInvoicesResponse {
  invoices: ApiInvoice[];
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Table-compatible invoice type (extends API invoice with computed fields)
export interface TableInvoice extends Omit<ApiInvoice, 'amount'> {
  clientName: string;
  amount: number; // Use total instead of deprecated amount
  poolId?: string; // Optional for compatibility
}

export default function useGetInvoices(params: UseGetInvoicesParams) {
  const queryClient = useQueryClient();

  // Transform API invoice to table-compatible format
  const transformInvoice = (invoice: ApiInvoice): TableInvoice => {
    return {
      ...invoice,
      clientName: `${invoice.client.firstName} ${invoice.client.lastName}`,
      amount: invoice.total, // Use total instead of deprecated amount field
      issuedDate: invoice.issuedDate, // Keep as string, columns will convert when needed
      dueDate: invoice.dueDate // Keep as string, columns will convert when needed
    };
  };

  const query = useQuery({
    queryKey: ['invoices', params],
    queryFn: async () => {
      // Build query params - only include defined, non-null values
      const queryParams: Record<string, string> = {};
      
      if (params.page) {
        queryParams.page = params.page.toString();
      }
      if (params.clientId) {
        queryParams.clientId = params.clientId;
      }
      if (params.companyOwnerId) {
        queryParams.companyOwnerId = params.companyOwnerId;
      }
      if (params.status) {
        queryParams.status = params.status;
      }
      if (params.fromDate) {
        queryParams.fromDate = params.fromDate;
      }
      if (params.toDate) {
        queryParams.toDate = params.toDate;
      }

      const response = await clientAxios.get<ListInvoicesResponse>('/invoices', {
        params: queryParams
      });

      // Transform invoices to table-compatible format
      const transformedInvoices = response.data.invoices.map(transformInvoice);

      return {
        ...response.data,
        invoices: transformedInvoices
      };
    },
    staleTime: Infinity
  });

  const refetch = async (newParams: UseGetInvoicesParams) => {
    return queryClient.fetchQuery({
      queryKey: ['invoices', newParams],
      queryFn: async () => {
        // Build query params - only include defined, non-null values
        const queryParams: Record<string, string> = {};
        
        if (newParams.page) {
          queryParams.page = newParams.page.toString();
        }
        if (newParams.clientId) {
          queryParams.clientId = newParams.clientId;
        }
        if (newParams.companyOwnerId) {
          queryParams.companyOwnerId = newParams.companyOwnerId;
        }
        if (newParams.status) {
          queryParams.status = newParams.status;
        }
        if (newParams.fromDate) {
          queryParams.fromDate = newParams.fromDate;
        }
        if (newParams.toDate) {
          queryParams.toDate = newParams.toDate;
        }

        const response = await clientAxios.get<ListInvoicesResponse>('/invoices', {
          params: queryParams
        });

        // Transform invoices to table-compatible format
        const transformedInvoices = response.data.invoices.map(transformInvoice);

        return {
          ...response.data,
          invoices: transformedInvoices
        };
      }
    });
  };

  return { ...query, refetch };
}
