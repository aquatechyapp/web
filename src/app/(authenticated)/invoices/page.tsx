'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { PlusIcon } from '@radix-ui/react-icons';
import { X, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { useUserStore } from '@/store/user';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PaginationDemo } from '@/components/PaginationDemo';
import useGetInvoices, { UseGetInvoicesParams, TableInvoice } from '@/hooks/react-query/invoices/useGetInvoices';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import { useDownloadInvoicePDF } from '@/hooks/react-query/invoices/useDownloadInvoicePDF';
import { useUpdateInvoiceStatus } from '@/hooks/react-query/invoices/useUpdateInvoiceStatus';
import { useExportInvoicesCSV } from '@/hooks/react-query/invoices/useExportInvoicesCSV';
import { useDeleteInvoice } from '@/hooks/react-query/invoices/useDeleteInvoice';
import ConfirmActionDialog from '@/components/confirm-action-dialog';

import { InvoiceSummaryCards } from './_components/InvoiceSummaryCards';
import { DataTableInvoices } from './DataTableInvoices/index';
import { createColumns } from './DataTableInvoices/columns';

// Get the first day of the current month at 00:00:00
const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};

// Get today at 23:59:59
const getTodayEnd = () => {
  const now = new Date();
  return new Date(now.setHours(23, 59, 59, 999));
};

const defaultDateFrom = getFirstDayOfMonth();
const defaultDateTo = getTodayEnd();

interface FilterFormData {
  from?: Date;
  to?: Date;
  status: string;
  client: string;
  company: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { data: allClients } = useGetAllClients();
  const { data: companies = [] } = useGetCompanies();
  const { mutateAsync: downloadPDF } = useDownloadInvoicePDF();
  const { mutateAsync: updateInvoiceStatus } = useUpdateInvoiceStatus();
  const { mutateAsync: exportInvoicesCSV, isPending: isExporting } = useExportInvoicesCSV();
  const { mutateAsync: deleteInvoice, isPending: isDeleting } = useDeleteInvoice();

  // Initialize filters and pagination
  const [currentFilters, setCurrentFilters] = useState<UseGetInvoicesParams>({
    page: 1,
    clientId: null,
    companyOwnerId: null,
    status: null,
    fromDate: defaultDateFrom.toISOString().split('T')[0],
    toDate: defaultDateTo.toISOString()
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Match backend limit
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<TableInvoice | null>(null);

  const filtersForm = useForm<FilterFormData>({
    defaultValues: {
      from: defaultDateFrom,
      to: defaultDateTo,
      status: 'all',
      client: 'all',
      company: 'all'
    }
  });

  // Fetch invoices with current filters
  const invoicesQuery = useGetInvoices({
    ...currentFilters,
    page: currentPage
  });

  // Auth check
  useEffect(() => {
    if (user.firstName === '') {
      router.push('/onboarding');
    }
  }, [user, router]);

  // Get clients list for filter dropdown
  const clients = useMemo(() => {
    if (!allClients) return [];
    return allClients
      .filter((client) => client.isActive)
      .map((client) => ({
        id: client.id,
        name: client.fullName || `${client.firstName} ${client.lastName}`
      }));
  }, [allClients]);

  // Get companies list for filter dropdown
  const companiesList = useMemo(() => {
    if (!companies || companies.length === 0) return [];
    return companies.map((company) => ({
      id: company.id,
      name: company.name
    }));
  }, [companies]);

  // Get unique clients from current invoices (for backward compatibility)
  const invoiceClients = useMemo(() => {
    const clientMap = new Map<string, { id: string; name: string }>();
    invoicesQuery.data?.invoices.forEach((inv) => {
      if (!clientMap.has(inv.clientId)) {
        clientMap.set(inv.clientId, { id: inv.clientId, name: inv.clientName });
      }
    });
    return Array.from(clientMap.values());
  }, [invoicesQuery.data?.invoices]);

  // Watch form values
  const watchedFrom = filtersForm.watch('from');
  const watchedTo = filtersForm.watch('to');
  const watchedStatus = filtersForm.watch('status');
  const watchedClient = filtersForm.watch('client');
  const watchedCompany = filtersForm.watch('company');

  const appliedFilters = useMemo(() => {
    let count = 0;
    if (watchedStatus && watchedStatus !== 'all') count++;
    if (watchedClient && watchedClient !== 'all') count++;
    if (watchedCompany && watchedCompany !== 'all') count++;
    if (watchedFrom && watchedFrom.getTime() !== defaultDateFrom.getTime()) count++;
    if (watchedTo && watchedTo.getTime() !== defaultDateTo.getTime()) count++;
    return count;
  }, [watchedFrom, watchedTo, watchedStatus, watchedClient, watchedCompany]);

  const handleClearFilters = async () => {
    const firstOfMonth = getFirstDayOfMonth();
    const todayEnd = getTodayEnd();
    
    filtersForm.reset({
      from: firstOfMonth,
      to: todayEnd,
      status: 'all',
      client: 'all',
      company: 'all'
    });

    const newFilters: UseGetInvoicesParams = {
      page: 1,
      clientId: null,
      companyOwnerId: null,
      status: null,
      fromDate: firstOfMonth.toISOString().split('T')[0],
      toDate: todayEnd.toISOString()
    };

    setCurrentPage(1);
    setCurrentFilters(newFilters);
    await invoicesQuery.refetch({
      ...newFilters,
      page: 1
    });
  };

  // Apply filters when form values change
  useEffect(() => {
    const values = filtersForm.getValues();
    
    const newFilters: UseGetInvoicesParams = {
      page: 1, // Reset to first page when filters change
      clientId: values.client && values.client !== 'all' ? values.client : null,
      companyOwnerId: values.company && values.company !== 'all' ? values.company : null,
      status: values.status && values.status !== 'all' ? (values.status as UseGetInvoicesParams['status']) : null,
      fromDate: values.from ? values.from.toISOString().split('T')[0] : null,
      toDate: values.to ? new Date(values.to.setHours(23, 59, 59, 999)).toISOString() : null
    };

    // Only update if filters actually changed
    const filtersChanged = 
      newFilters.clientId !== currentFilters.clientId ||
      newFilters.companyOwnerId !== currentFilters.companyOwnerId ||
      newFilters.status !== currentFilters.status ||
      newFilters.fromDate !== currentFilters.fromDate ||
      newFilters.toDate !== currentFilters.toDate;

    if (filtersChanged) {
      setCurrentPage(1);
      setCurrentFilters(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFrom, watchedTo, watchedStatus, watchedClient, watchedCompany]);

  // Action handlers
  const handleView = (invoice: TableInvoice) => {
    router.push(`/invoices/${invoice.id}`);
  };

  const handleEdit = (invoice: TableInvoice) => {
    // TODO: Open edit modal
    console.log('Edit invoice:', invoice);
  };

  const handleDelete = (invoice: TableInvoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (invoiceToDelete) {
      await deleteInvoice({ invoiceId: invoiceToDelete.id });
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  const handleDownload = async (invoice: TableInvoice) => {
    await downloadPDF({ invoiceId: invoice.id });
  };

  const handleMarkPaid = async (invoice: TableInvoice) => {
    await updateInvoiceStatus({
      invoiceId: invoice.id,
      status: 'paid'
    });
  };

  const handleMarkUnpaid = async (invoice: TableInvoice) => {
    await updateInvoiceStatus({
      invoiceId: invoice.id,
      status: 'unpaid'
    });
  };

  const handleCreateInvoice = () => {
    router.push('/invoices/new');
  };

  const handleExport = async () => {
    const values = filtersForm.getValues();
    
    await exportInvoicesCSV({
      clientId: values.client && values.client !== 'all' ? values.client : null,
      companyOwnerId: values.company && values.company !== 'all' ? values.company : null,
      status: values.status && values.status !== 'all' ? (values.status as 'paid' | 'unpaid' | 'draft' | 'overdue' | 'cancelled') : null,
      fromDate: values.from ? values.from.toISOString().split('T')[0] : null,
      toDate: values.to ? new Date(new Date(values.to).setHours(23, 59, 59, 999)).toISOString() : null
    });
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await invoicesQuery.refetch({
      ...currentFilters,
      page
    });
  };

  const columns = createColumns(
    handleView as any,
    handleEdit as any,
    handleDelete as any,
    handleDownload as any,
    handleMarkPaid as any,
    handleMarkUnpaid as any
  );

  if (invoicesQuery.isLoading) return <LoadingSpinner />;

  return (
    <FormProvider {...filtersForm}>
      <div className="flex flex-col gap-6 p-2">
        {/* Delete Confirmation Dialog */}
        <ConfirmActionDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Delete Invoice"
          description={
            invoiceToDelete
              ? `Are you sure you want to delete invoice #${invoiceToDelete.invoiceNumber}? This action cannot be undone.`
              : 'Are you sure you want to delete this invoice? This action cannot be undone.'
          }
          confirmText={isDeleting ? 'Deleting...' : 'Delete'}
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          variant="destructive"
        />
        {/* Action Buttons and Date Filters */}
        <form className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={handleCreateInvoice}>
              <PlusIcon className="mr-2" />
              Create Invoice
            </Button>
            <Button type="button" variant="outline" onClick={handleExport} disabled={isExporting}>
              <Download className="mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FormItem className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <FormLabel className="whitespace-nowrap">From</FormLabel>
              <FormControl>
                <DatePicker
                  className="w-full sm:w-fit"
                  placeholder="Issued From"
                  value={watchedFrom || defaultDateFrom}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(date);
                      localDate.setHours(0, 0, 0, 0);
                      filtersForm.setValue('from', localDate);
                    } else {
                      filtersForm.setValue('from', defaultDateFrom);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
            <FormItem className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <FormLabel className="whitespace-nowrap">To</FormLabel>
              <FormControl>
                <DatePicker
                  className="w-full sm:w-fit"
                  placeholder="Issued To"
                  value={watchedTo || defaultDateTo}
                  onChange={(date) => {
                    if (date) {
                      const localDate = new Date(date);
                      localDate.setHours(23, 59, 59, 999);
                      filtersForm.setValue('to', localDate);
                    } else {
                      filtersForm.setValue('to', defaultDateTo);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
            
            {appliedFilters > 0 && (
              <Button variant="outline" type="button" onClick={handleClearFilters}>
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {appliedFilters}
                </span>
                <span>Clear</span>
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>

        {/* Summary Cards */}
        <InvoiceSummaryCards invoices={invoicesQuery.data?.invoices as any || []} />

        {/* Data Table */}
        {invoicesQuery.isPending || invoicesQuery.isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4">
            <DataTableInvoices 
              columns={columns} 
              data={invoicesQuery.data?.invoices as any || []} 
              clients={clients.length > 0 ? clients : invoiceClients}
              companies={companiesList}
              onCompanyChange={(companyId) => {
                filtersForm.setValue('company', companyId);
              }}
            />
            
            {invoicesQuery.data && invoicesQuery.data.totalCount > 0 && (
              <div className="flex justify-center py-4">
                <PaginationDemo
                  currentPage={currentPage}
                  totalItems={invoicesQuery.data.totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </FormProvider>
  );
}

