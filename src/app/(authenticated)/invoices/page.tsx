'use client';

import { useMemo, useState } from 'react';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationDemo } from '@/components/PaginationDemo';
import useInvoices from '@/hooks/react-query/invoices/useInvoices';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { columns } from './DataTableInvoice/columns';
import { DataTableInvoice } from './DataTableInvoice';
import DataTableInvoiceSkeleton from './DataTableInvoice/skeleton';

export default function Page() {
  const { data: companies } = useGetCompanies();
  const { data: clients } = useGetAllClients();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const defaultItemsPerPage = 20;
  const router = useRouter();

  const invoiceParams = useMemo(() => ({
    page: currentPage,
    limit: defaultItemsPerPage,
    companyOwnerId: selectedCompany || undefined,
    clientId: selectedClient || undefined,
  }), [currentPage, defaultItemsPerPage, selectedCompany, selectedClient]);

  const invoicesQuery = useInvoices(invoiceParams);

  const invoices = invoicesQuery.listInvoices.data?.invoices;
  const totalItems = invoicesQuery.listInvoices.data?.totalCount || 0;
  const itemsPerPage = invoicesQuery.listInvoices.data?.itemsPerPage || defaultItemsPerPage;
  const isLoading = invoicesQuery.listInvoices.isLoading;
  const isError = invoicesQuery.listInvoices.isError;

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col w-full p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <Select
            value={selectedCompany}
            onValueChange={(value) => {
              setSelectedCompany(value);
              setSelectedClient('');
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            disabled={!selectedCompany}
            value={selectedClient}
            onValueChange={(value) => {
              setSelectedClient(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients
                ?.filter((client) => client.companyOwnerId === selectedCompany)
                .map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.fullName || `${client.firstName} ${client.lastName}`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          size="sm"
          className="w-full md:w-auto h-auto px-4 py-2 md:px-6 md:py-3"
          onClick={() => router.push('/invoices/create')}
        >
          Create invoice
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        {isLoading &&
          <DataTableInvoiceSkeleton />
          }

        {isError && <div className="p-4 text-center text-red-500">Error loading invoices.</div>}

        {(invoices ?? []).length > 0 ? (
          <DataTableInvoice columns={columns} data={invoices || []} />
        ) : (
          <div className="p-6 text-center text-gray-500">
            No invoices found.{' '}
            <a
              href="/invoices/create"
              className="text-blue-600 hover:underline"
            >
              Create your first invoice
            </a>
          </div>
        )}
      </div>

        {(invoices ?? []).length > 0 && totalItems > 0 && (
          <div className="flex justify-center">
            <PaginationDemo
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}

    </div>
  );
}
