'use client';

import { useState } from 'react';
import useGetCompanies from '@/hooks/react-query/companies/getCompanies';
import useGetAllClients from '@/hooks/react-query/clients/getAllClients';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaginationDemo } from '@/components/PaginationDemo';
import useInvoices from '@/hooks/react-query/invoices/useInvoices';
import Link from 'next/link';

export default function Page() {
  const { data: companies } = useGetCompanies();
  const { data: clients } = useGetAllClients();
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const defaultItemsPerPage = 20;

  const invoicesQuery = useInvoices({
    page: currentPage,
    limit: defaultItemsPerPage,
    companyId: selectedCompany || undefined,
    clientId: selectedClient || undefined,
  });

  const invoices = invoicesQuery.listInvoices.data?.invoices;
  const totalItems = invoicesQuery.listInvoices.data?.totalCount || 0;
  const itemsPerPage = invoicesQuery.listInvoices.data?.itemsPerPage || defaultItemsPerPage;
  const isLoading = invoicesQuery.listInvoices.isLoading;
  const isError = invoicesQuery.listInvoices.isError;

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col w-full p-4 md:p-10 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">From (Company)</label>
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
          <label className="block text-xs font-medium text-gray-600 mb-1">To (Client)</label>
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
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        {isLoading && <div className="p-4 text-center">Loading invoices...</div>}
        {isError && <div className="p-4 text-center text-red-500">Error loading invoices.</div>}

        {(invoices ?? []).length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(invoices ?? []).map((inv, idx) => (
                <tr key={inv.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{inv.id}</td>
                  <td className="px-4 py-2">{inv.clientId}</td>
                  <td className="px-4 py-2">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-2">{inv.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
