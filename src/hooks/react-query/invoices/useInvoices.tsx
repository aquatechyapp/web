import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { clientAxios } from '@/lib/clientAxios';

// Payload para os items da fatura
export interface InvoiceItemPayload {
  name: string;
  pricePerUnit: number;
  units: number;
}

interface UseInvoicesParams {
  page?: number;
  limit?: number;
  companyOwnerId?: string;
  clientId?: string;
}
// Payload para criar/atualizar fatura
export interface InvoicePayload {
  clientId: string;
  companyId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  type?: 'OneTime' | 'Recurring';
  status?: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled' | 'Void';
  currency?: string;
  notes?: string;
  description?: string;
  items: InvoiceItemPayload[];
  autoSendEmail?: boolean;
  emailRecipient?: string;
  recurringInterval?: 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  recurringStartDate?: string;
  recurringEndDate?: string;
  recurringDayOfMonth?: number;
  recurringEmailDayOfMonth?: number;
  isRecurringTemplate?: boolean;
}

export default function useInvoices(params?: UseInvoicesParams, id?:string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = Cookies.get('userId');

  if (!userId) router.push('/login');
  const safeParams: UseInvoicesParams = params ?? {};

  // LIST INVOICES
  const listInvoices = useQuery<
    { invoices: any[]; totalCount: number; currentPage: number; itemsPerPage: number; totalPages: number },
    Error
  >({
    queryKey: ['invoices', params],
    queryFn: async () => {
      console.log("GET chamado");
      const { data } = await clientAxios.get('/invoices', { params });
      return data;
    },
    enabled: !!safeParams.page,   // ⬅️ só chama se page existir
    staleTime: 1000 * 60 * 5,
  });
  // 🔍 GET INVOICE BY ID
  const invoiceById = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const { data } = await clientAxios.get(`/invoices/${id}`);
      return data.invoice;
    },
    enabled: !!id, // só executa se tiver ID
    staleTime: 1000 * 60 * 5,
  });

  // CREATE INVOICE
  const createInvoice = useMutation<any, Error, InvoicePayload>({
    mutationFn: async (payload: InvoicePayload) => {
      const { data } = await clientAxios.post('/invoices', payload);
      return data.invoice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // UPDATE INVOICE
  const updateInvoice = useMutation<any, Error, { invoiceId: string; payload: Partial<InvoicePayload> }>({
    mutationFn: async ({ invoiceId, payload }) => {
      const { data } = await clientAxios.patch(`/invoices/${invoiceId}`, payload);
      return data.invoice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // DELETE INVOICE
  const deleteInvoice = useMutation<string, Error, string>({
    mutationFn: async (invoiceId) => {
      const { data } = await clientAxios.delete(`/invoices/${invoiceId}`);
      return data.message;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // UPDATE PAYMENT STATUS
  const updatePaymentStatus = useMutation<
    any,
    Error,
    {
      invoiceId: string;
      paymentStatus: 'pending' | 'overdue' | 'succeeded' | 'processing' | 'failed';
      paidAt?: string;
      paidAmount?: number;
      paymentMethod?: string;
    }
  >({
    mutationFn: async ({ invoiceId, paymentStatus, paidAt, paidAmount, paymentMethod }) => {
      const { data } = await clientAxios.patch(`/invoices/${invoiceId}/payment-status`, {
        paymentStatus,
        paidAt,
        paidAmount,
        paymentMethod,
      });
      return data.invoice;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  // CREATE RECURRING TEMPLATE
  const createRecurringTemplate = useMutation<any, Error, InvoicePayload>({
    mutationFn: async (payload: InvoicePayload) => {
      const { data } = await clientAxios.post('/invoices/recurring-template', payload);
      return data.template;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });

  const isLoadingOverall =
    listInvoices.isLoading ||
    (id && invoiceById.isLoading) ||
    createInvoice.isPending ||
    updateInvoice.isPending;

  const isReady = !isLoadingOverall && (!id || !!invoiceById.data);

  return {
    isReady,
    listInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updatePaymentStatus,
    createRecurringTemplate,
    invoiceById
  };
}
